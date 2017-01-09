import _ from 'lodash';
import fs from 'fs';
import path from 'path';

export default class FindAndReplacer {
    constructor(path, keyDefinitions) {
        this.path = path;
    }

    replace() {
        console.log('replace', this.path);

        this.readDirectory(this.path)
            .then(() => {
                console.log('--- DONE READING ---');
            });
    }

    readDirectory(dirPath) {
        return new Promise((resolve, reject) => {
            console.log('READ_DIRECTORY', dirPath);

            const contents = fs.readdirSync(dirPath);

            const promList = contents.map((contentItem) => {
                const replacedString = _.replace(contentItem, '_OLLIE_NAME_', 'naampie');
                const oldPath = path.join(dirPath, contentItem)
                const newPath = path.join(dirPath, replacedString);

                if (oldPath !== newPath) {
                    fs.renameSync(oldPath, newPath);
                }

                const stats = fs.statSync(newPath);
                if (stats.isDirectory()) {
                    return this.readDirectory(newPath);
                } else {
                    return Promise.resolve();
                }

            });

            Promise.all(promList).then(resolve);
        });
    }

    
    replaceDirectoryName() {
    }

    replaceFileName() {
    }

    replaceContent() {
    }
}