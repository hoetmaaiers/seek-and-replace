import fs from 'fs';
import should from 'should';
import { execSync } from 'child_process';
import FindAndReplacer from './../src/find-and-replace';

const keyDefinitions = [
    {
        key: 'NAME',
        replacement: 'naampie'
    }, {
        key: 'AUTHOR',
        replacement: 'Lenny'
    }
];

describe('FindAndReplacer', function () {

    before(function () {
        // create dummy directories & files
        const DIRECTORIES = [
            '.tmp',
            '.tmp/test',
            '.tmp/test_OLLIE_NAME_',
            '.tmp/test_OLLIE_NAME_/test_2_OLLIE_AUTHOR_',
        ];

        const FILES = [
            '.tmp/test/foo.txt',
            '.tmp/test_OLLIE_NAME_/foo.txt',
            '.tmp/test_OLLIE_NAME_/foo_OLLIE_YEAR_bar.txt',
        ];

        DIRECTORIES.forEach((directory) => execSync(`mkdir ${directory}`));
        FILES.forEach((file) => execSync(`touch ${file}`))

        const DUMMY_FILE_CONTENT = [
            'Lorem ipsum dolor sit amet',
            'blabla, blieblie, _OLLIE_NAME_ boemboem',
            'amet sit dolor ipsum lorem',
        ] ;
        fs.writeFileSync(FILES[0], DUMMY_FILE_CONTENT.join('\n'));
    });

    beforeEach(function () {
    });


    describe('#replace', function () {


        it('should replace a directory variable part', function () {

            const replacer = new FindAndReplacer('.tmp', keyDefinitions);
            replacer.replace();

            const dirContents = fs.readdirSync('.tmp');

            dirContents[1].should.equal('testnaampie');
        });

        it('should replace a variable nested directory variable part', function () {

            const replacer = new FindAndReplacer('.tmp', keyDefinitions);
            replacer.replace();

            const dirContents = fs.readdirSync('.tmp/testnaampie');
            dirContents[2].should.equal('test_2Lenny');
        })

        it('should replace a files content variable part', function () {
            const replacer = new FindAndReplacer('.tmp', keyDefinitions);
            replacer.replace();

            const fileContents = fs.readFileSync('.tmp/test/foo.txt', { encoding: 'utf8'});
            const fileContentsArray = fileContents.split('\n');
            fileContentsArray[1].should.equal('blabla, blieblie, naampie boemboem');
        })
    });

    describe('#smartReplace', function () {
        it('should replace a variable', function () {
            const result = FindAndReplacer.smartReplace('abc _OLLIE_NAME_', 'NAME', 'BLAblaBLA');
            result.should.equal('abc BLAblaBLA');
        });

        it('should replace a variable AS DOMAIN', function () {
            const result = FindAndReplacer.smartReplace('_OLLIE_NAME_AS_DOMAIN_', 'NAME', 'Point of Sale');
            result.should.equal('pointofsale');
        });

        it('should replace a variable WITHOUT_SPACES', function () {
            const result = FindAndReplacer.smartReplace('_OLLIE_NAME_WITHOUT_SPACES_', 'NAME', 'Point of Sale');
            result.should.equal('PointofSale');
        });

        it('should replace a variable LOWER_CASE', function () {
            const result = FindAndReplacer.smartReplace('_OLLIE_NAME_LOWER_CASE_', 'NAME', 'Point of Sale');
            result.should.equal('point of sale');
        });

        it('should replace a variable UPPER_CASE', function () {
            const result = FindAndReplacer.smartReplace('_OLLIE_NAME_UPPER_CASE_', 'NAME', 'Point of Sale');
            result.should.equal('POINT OF SALE');
        });

        it('should replace a variable SNAKE_CASE', function () {
            const result = FindAndReplacer.smartReplace('_OLLIE_NAME_SNAKE_CASE_', 'NAME', 'Point of Sale');
            result.should.equal('point_of_sale');
        });

    })

    after(function () {
        // clean up dummy directories & files
        execSync(`rm -rf .tmp`);
    });
});
