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
    });

    after(function () {
        // clean up dummy directories & files
        execSync(`rm -rf .tmp`);
    });
});
