import fs from 'fs';
import should from 'should';
import { execSync } from 'child_process';
import SeekAndReplace from './../src/seek-and-replace';

const keyDefinitions = [
    {
        key: 'NAME',
        replacement: 'naampie',
    }, {
        key: 'AUTHOR',
        replacement: 'Jimmy Joe',
    },
];

describe('SeekAndReplace', function () {

    beforeEach(function () {
        // create dummy directories & files
        const DIRECTORIES = [
            '.tmp',
            '.tmp/test',
            '.tmp/test_OLLIE_NAME_',
            '.tmp/test_OLLIE_NAME_/test_2_OLLIE_AUTHOR_',
            '.tmp/.ignore',
        ];

        const FILES = [
            '.tmp/test/foo.txt',
            '.tmp/test_OLLIE_NAME_/foo.txt',
            '.tmp/test_OLLIE_NAME_/foo_OLLIE_YEAR_bar.txt',
            '.tmp/.ignore/foo_OLLIE_NAME_bar.txt',
        ];

        DIRECTORIES.forEach((directory) => execSync(`mkdir ${directory}`));
        FILES.forEach((file) => execSync(`touch ${file}`))

        const DUMMY_FILE_CONTENT = [
            'Lorem ipsum dolor sit amet _OLLIE_AUTHOR_KEBAB_CASE_',
            'blabla, blieblie, _OLLIE_NAME_ boemboem',
            'amet sit _OLLIE_NAME_UPPER_CASE_ ipsum lorem',
            '_OLLIE_AUTHOR_UPPER_CASE_ the cowboy, _OLLIE_NAME_',
        ] ;
        fs.writeFileSync(FILES[0], DUMMY_FILE_CONTENT.join('\n'));
    });


    describe('#replace', function () {


        it('should replace a directory variable part', function () {

            const replacer = new SeekAndReplace('OLLIE', '.tmp', keyDefinitions);
            replacer.replace();

            const dirContents = fs.readdirSync('.tmp');
            dirContents[2].should.equal('testnaampie');
        });

        it('should replace a variable nested directory variable part', function () {

            const replacer = new SeekAndReplace('OLLIE', '.tmp', keyDefinitions);
            replacer.replace();

            const dirContents = fs.readdirSync('.tmp/testnaampie');
            dirContents[2].should.equal('test_2Jimmy Joe');
        });

        it('should replace a files content variable part', function () {
            const replacer = new SeekAndReplace('OLLIE', '.tmp', keyDefinitions);
            replacer.replace();

            const fileContents = fs.readFileSync('.tmp/test/foo.txt', { encoding: 'utf8'});
            const fileContentsArray = fileContents.split('\n');
            fileContentsArray[0].should.equal('Lorem ipsum dolor sit amet jimmy-joe');
            fileContentsArray[1].should.equal('blabla, blieblie, naampie boemboem');
            fileContentsArray[2].should.equal('amet sit NAAMPIE ipsum lorem');
        });

        it('should recursively replace multiple variable parts in a string', function () {
            const replacer = new SeekAndReplace('OLLIE', '.tmp', keyDefinitions);
            replacer.replace();

            const fileContents = fs.readFileSync('.tmp/test/foo.txt', { encoding: 'utf8'});
            const fileContentsArray = fileContents.split('\n');
            fileContentsArray[3].should.equal('JIMMY JOE the cowboy, naampie');
        });

        it('should ignore a dir path in options.ignore', function () {
            const replacer = new SeekAndReplace('OLLIE', '.tmp', keyDefinitions, {
                ignorePaths: ['.tmp/.ignore/*.txt']
            });
            replacer.replace();

            const dirContents = fs.readdirSync('.tmp/.ignore');
            dirContents[0].should.equal('foo_OLLIE_NAME_bar.txt');
        });
    });

    describe('#smartReplace', function () {
        it('should replace a variable', function () {
            const result = SeekAndReplace.smartReplace('OLLIE', 'abc _OLLIE_NAME_', 'NAME', 'BLAblaBLA');
            result.should.equal('abc BLAblaBLA');
        });

        it('should replace a variable AS DOMAIN', function () {
            const result = SeekAndReplace.smartReplace('OLLIE', '_OLLIE_NAME_AS_DOMAIN_', 'NAME', 'Point of Sale');
            result.should.equal('pointofsale');
        });

        it('should replace a variable WITHOUT_SPACES', function () {
            const result = SeekAndReplace.smartReplace('OLLIE', '_OLLIE_NAME_WITHOUT_SPACES_', 'NAME', 'Point of Sale');
            result.should.equal('PointofSale');
        });

        it('should replace a variable LOWER_CASE', function () {
            const result = SeekAndReplace.smartReplace('OLLIE', '_OLLIE_NAME_LOWER_CASE_', 'NAME', 'Point of Sale');
            result.should.equal('point of sale');
        });

        it('should replace a variable UPPER_CASE', function () {
            const result = SeekAndReplace.smartReplace('OLLIE', '_OLLIE_NAME_UPPER_CASE_', 'NAME', 'Point of Sale');
            result.should.equal('POINT OF SALE');
        });

        it('should replace a variable SNAKE_CASE', function () {
            const result = SeekAndReplace.smartReplace('OLLIE', '_OLLIE_NAME_SNAKE_CASE_', 'NAME', 'Point of Sale');
            result.should.equal('point_of_sale');
        });

        it('should replace a variable CAMEL_CASE', function () {
            const result = SeekAndReplace.smartReplace('OLLIE', '_OLLIE_NAME_CAMEL_CASE_', 'NAME', 'Point of Sale');
            result.should.equal('pointOfSale');
        });

        it('should replace a variable KEBAB_CASE', function () {
            const result = SeekAndReplace.smartReplace('OLLIE', '_OLLIE_NAME_KEBAB_CASE_', 'NAME', 'Point of Sale');
            result.should.equal('point-of-sale');
        });

        it('should replace a variable START_CASE', function () {
            const result = SeekAndReplace.smartReplace('OLLIE', '_OLLIE_NAME_START_CASE_', 'NAME', 'Point of Sale');
            result.should.equal('Point Of Sale');
        });

    });

    afterEach(function () {
        // clean up dummy directories & files
        execSync(`rm -rf .tmp`);
    });
});
