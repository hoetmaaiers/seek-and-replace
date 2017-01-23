# Seek and Replace

Find and replace string occurrences in directories, files and fileContent.

[![Build Status](https://travis-ci.org/hoetmaaiers/find-and-replace.svg?branch=master)](https://travis-ci.org/hoetmaaiers/find-and-replace)

# Usage

## Instance

We create a SeekAndReplace instance by providing two paramters:
- replacePath: the where replacement should start
- keyDefinitions: which are `{ key, replacement }` objects defining what key to search for and with which value to replace it with

```javascript
const namespace = 'OLLIE';
const replacePath = './src';

const keyDefinitions = [
    {
        key: 'NAME',
        replacement: 'naampie',
    }, {
        key: 'AUTHOR',
        replacement: 'Jimmy',
    },
];

const replacer = new SeekAndReplace(namespace, replacePath, keyDefinitions);
```


## instance.replace()

A SeekAndReplace instance has 1 key functionality: **replace**! When calling  `instance.replace()` all directories, files and file contents starting at the replacePath will be scanned and replaced with all key definitions.


    
## SeekAndReplace.smartReplace()

SeekAndReplace exposes a static method `smartReplace` which is used by the SeekAndReplace instance but can also be used outside separately.

```javascript
SeekAndReplace.smartReplace(namespace, string, key, replacement)
```


# Smart replace transformations

Key definitions can have smart transformations applied to it. The format is `_OLLIE_NAME_TRANSFORMATION_`.

The following transformations are supported:

| Definition |  Example |
|---------------|--------------|
| *none*  | Point of Sale  |
| \_AS\_DOMAIN\_ | pointofsale |
| \_WITHOUT\_SPACES\_ | PointofSale |
| \_LOWER\_CASE\_ | point of sale |
| \_UPPER\_CASE\_ | POINT OF SALE |
| \_SNAKE\_CASE\_ | point\_of\_sale |
| \_CAMEL\_CASE\_ | pointOfSale |
| \_KEBAB\_CASE\_ | point-of-sale |
| \_START\_CASE\_ | Point Of Sale |

