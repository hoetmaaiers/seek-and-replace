import _ from 'lodash';
import fs from 'fs';
import path from 'path';

export default class SeekdAndReplace{
    constructor(namespace = '', replacePath, keyDefinitions) {
        this.namespace = namespace;
        this.path = replacePath;
        this.keyDefinitions = keyDefinitions;
    }

    replace() {

        this.renameDirectoriesAndFiles(this.path)
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
                        return this.renamePathWithDefinition(dirPath, contentItem, keyDefinition);
                    });

                    Promise.all(renamePromList)
                        .then(resolve)
                        .catch(reject);
                });
            });

            Promise.all(keyDefinitionPromList).then(resolve);


        });
    }

    renamePathWithDefinition(dirPath, item, keyDefinition) {
        const replacedString = SeekdAndReplace.smartReplace(this.namespace, item, keyDefinition.key, keyDefinition.replacement);
        const oldPath = path.join(dirPath, item);
        const newPath = path.join(dirPath, replacedString);

        if (oldPath !== newPath) {
            fs.renameSync(oldPath, newPath);
        }

        const stats = fs.statSync(newPath);
        if (stats.isDirectory()) {
            return this.renameDirectoriesAndFiles(newPath);
        } else if (stats.isFile()) {
            return this.renameFileContents(newPath);1
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
        const fileContents = fs.readFileSync(filePath, { encoding: 'utf8' });
        const replacedFileContents = SeekdAndReplace.smartReplace(this.namespace, fileContents, keyDefinition.key, keyDefinition.replacement);

        if (fileContents !== replacedFileContents) {
            fs.writeFileSync(filePath, replacedFileContents);
        }

        return Promise.resolve();
    }

    static smartReplace(namespace, string, key, replacement) {
        const TRANSFORMATIONS = [
            'AS_DOMAIN',
            'WITHOUT_SPACES',
            'LOWER_CASE',
            'UPPER_CASE',
        ];

        const namespacedKey = '_' + _.compact([namespace, key]).join('_');

        if (_.includes(string, 'AS_DOMAIN')) {
            let transformedReplacement = _.chain(replacement).camelCase().toLower().value();
            return _.replace(string, `${namespacedKey}_AS_DOMAIN_`, transformedReplacement);

        } else if (_.includes(string, 'WITHOUT_SPACES')) {
            let transformedReplacement = replacement.split(' ').join('');
            return _.replace(string, `${namespacedKey}_WITHOUT_SPACES_`, transformedReplacement);

        } else if (_.includes(string, 'LOWER_CASE')) {
            let transformedReplacement = _.lowerCase(replacement);
            return _.replace(string, `${namespacedKey}_LOWER_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'UPPER_CASE')) {
            let transformedReplacement = _.upperCase(replacement);
            return _.replace(string, `${namespacedKey}_UPPER_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'SNAKE_CASE')) {
            let transformedReplacement = _.snakeCase(replacement);
            return _.replace(string, `${namespacedKey}_SNAKE_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'CAMEL_CASE')) {
            let transformedReplacement = _.camelCase(replacement);
            return _.replace(string, `${namespacedKey}_CAMEL_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'KEBAB_CASE')) {
            let transformedReplacement = _.kebabCase(replacement);
            return _.replace(string, `${namespacedKey}_KEBAB_CASE_`, transformedReplacement);

        } else if (_.includes(string, 'START_CASE')) {
            let transformedReplacement = _.startCase(replacement);
            return _.replace(string, `${namespacedKey}_START_CASE_`, transformedReplacement);

        } else {
            return _.replace(string, `${namespacedKey}_`, replacement);
        }
    }
}