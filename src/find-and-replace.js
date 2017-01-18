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
            .then(this.renameFileContents.bind(this, this.path))
            .catch((err) => {
                console.log('ERROR catched', err);
            });
    }

    renameDirectoriesAndFiles(dirPath) {
        return new Promise((resolve, reject) => {

            const keyDefinitionPromList = this.keyDefinitions.map((keyDefinition) => {

                const contents = fs.readdirSync(dirPath);

                return new Promise((resolve, reject) => {
                    const renamePromList = contents.map((contentItem) => {
                        this.renamePathWithDefinition(dirPath, contentItem, keyDefinition);
                    });

                    Promise.all(renamePromList).then(resolve);
                });
            });

            Promise.all(keyDefinitionPromList).then(resolve);


        });
    }

    renamePathWithDefinition(dirPath, item, keyDefinition) {
        const replacedString = FindAndReplacer.smartReplace(item, keyDefinition.key, keyDefinition.replacement);
        const oldPath = path.join(dirPath, item)
        const newPath = path.join(dirPath, replacedString);

        if (oldPath !== newPath) {
            fs.renameSync(oldPath, newPath);
        }

        const stats = fs.statSync(newPath);
        if (stats.isDirectory()) {
            return this.renameDirectoriesAndFiles(newPath);
        } else if (stats.isFile) {
            return this.renameFileContents(newPath);
        } else {
            return Promise.resolve();
        }
    }


    renameFileContents(filePath) {
        return new Promise((resolve, reject) => {
            const promList = this.keyDefinitions.map((keyDefinition) => {
                this.renameFileWithDefinition(filePath, keyDefinition);
            });
        });
    }

    renameFileWithDefinition(filePath, keyDefinition) {
        const fileContents = fs.readFileSync('.tmp/test/foo.txt', { encoding: 'utf8' });
        const replacedFileContents = FindAndReplacer.smartReplace(fileContents, keyDefinition.key, keyDefinition.replacement);

        if (fileContents !== replacedFileContents) {
            fs.writeFileSync(filePath, replacedFileContents);
        }

        return Promise.resolve();
    }

    static smartReplace(string, key, replacement) {
        const TRANSFORMATIONS = [
            'AS_DOMAIN',
            'WITHOUT_SPACES',
            'LOWER_CASE',
            'UPPER_CASE',
        ];


        if (_.includes(string, 'AS_DOMAIN')) {
            let transformedReplacement = _.chain(replacement).camelCase().toLower().value();
            return _.replace(string, `_OLLIE_${key}_AS_DOMAIN_`, transformedReplacement);

        } else if (_.includes(string, 'WITHOUT_SPACES')) {
            let transformedReplacement = replacement.split(' ').join('');
            return _.replace(string, `_OLLIE_${key}_WITHOUT_SPACES_`, transformedReplacement);

        } else if (_.includes(string, 'LOWER_CASE')) {
            let transformedReplacement = replacement.toLowerCase();
            return _.replace(string, `_OLLIE_${key}_LOWER_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'UPPER_CASE')) {
            let transformedReplacement = replacement.toUpperCase();
            return _.replace(string, `_OLLIE_${key}_UPPER_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'SNAKE_CASE')) {
            let transformedReplacement = _.snakeCase(replacement);
            return _.replace(string, `_OLLIE_${key}_SNAKE_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'CAMEL_CASE')) {
            let transformedReplacement = _.camelCase(replacement);
            return _.replace(string, `_OLLIE_${key}_CAMEL_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'KEBAB_CASE')) {
            let transformedReplacement = _.kebabCase(replacement);
            return _.replace(string, `_OLLIE_${key}_KEBAB_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'START_CASE')) {
            let transformedReplacement = _.startCase(replacement);
            return _.replace(string, `_OLLIE_${key}_START_CASE_`, transformedReplacement);

        } else {
            return _.replace(string, `_OLLIE_${key}_`, replacement);
        }
    }
}