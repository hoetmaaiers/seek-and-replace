import _ from 'lodash';
import fs from 'fs';
import path from 'path';

export default class FindAndReplacer {
    constructor(path, keyDefinitions) {
        this.path = path;
    }

    replace() {
        console.log('replace', this.path);

        this.readDirectory(this.path);
    }

    readDirectory(dirPath) {
        const contents = fs.readdirSync(dirPath);

        contents.forEach((contentItem) => {
            if (_.includes(contentItem, '_OLLIE_NAME_')) {
                const replacedString = _.replace(contentItem, '_OLLIE_NAME_', 'naampie');
                const oldPath = path.join(dirPath, contentItem)
                const newPath = path.join(dirPath, replacedString);

                fs.renameSync(oldPath, newPath);
            }
        });
    }

    
    replaceDirectoryName() {
    }

    replaceFileName() {
    }

    replaceContent() {
    }
}