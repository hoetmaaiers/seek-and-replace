import _ from 'lodash';
import fs from 'fs';
import path from 'path';

export default class FindAndReplacer {
    constructor(path, keyDefinitions) {
        this.path = path;
        this.keyDefinitions = keyDefinitions;
    }

    replace() {

        this.renameDirectoriesAndFiles(this.path)
            .then(() => {
                // this.renameFileContents(this.path);
            })
            .catch((err) => {
                console.log('ERROR catched', err);
            });
    }

    renameDirectoriesAndFiles(dirPath) {
        return new Promise((resolve, reject) => {

            const keyDefinitionPromList = this.keyDefinitions.map((keyDefintion) => {

                const contents = fs.readdirSync(dirPath);

                return new Promise((resolve, reject) => {
                    const renamePromList = contents.map((contentItem) => {
                        this.renamePathWithDefinition(dirPath, contentItem, keyDefintion);
                    });

                    Promise.all(renamePromList).then(resolve);
                });
            });

            Promise.all(keyDefinitionPromList).then(resolve);


        });
    }

    renamePathWithDefinition(dirPath, item, keyDefintion) {
        const replacedString = _.replace(item, `_OLLIE_${keyDefintion.key}_`, keyDefintion.replacement);
        const oldPath = path.join(dirPath, item)
        const newPath = path.join(dirPath, replacedString);

        if (oldPath !== newPath) {
            fs.renameSync(oldPath, newPath);
        }

        const stats = fs.statSync(newPath);
        if (stats.isDirectory()) {
            return this.renameDirectoriesAndFiles(newPath);
        } else {
            return Promise.resolve();
        }

    }
}