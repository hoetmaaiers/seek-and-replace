import fs from 'fs';
import should from 'should';
import { execSync } from 'child_process';
import FindAndReplacer from './../src/find-and-replace';


describe('FindAndReplacer', function () {

    before(function () {
        // create dummy directories & files
        const DIRECTORIES = [
            '.tmp',
            '.tmp/test',
            '.tmp/test_OLLIE_NAME_',
        ];

        const FILES = [
            '.tmp/test/foo.txt',
            '.tmp/test_OLLIE_NAME_/foo.txt',
            '.tmp/test_OLLIE_NAME_/fÎoo_OLLIE_YEAR_bar.txt',
        ];

        DIRECTORIES.forEach((directory) => execSync(`mkdir ${directory}`));
        FILES.forEach((file) => execSync(`touch ${file}`))

    });

    beforeEach(function () {
    });


    describe('#replace', function () {

        it('should replace a directory variable part', function () {
            const keyDefinitions = [
                {
                    key: 'NAME',
                    replacement: 'naampie'
                }
            ];

            const replacer = new FindAndReplacer('.tmp', keyDefinitions);
            replacer.replace();

            const dirContents = fs.readdirSync('.tmp');

            dirContents[1].should.equal('testnaampie');
        });
    });

    after(function () {
        // clean up dummy directories & files
        execSync(`rm -rf .tmp`);
    });
});
