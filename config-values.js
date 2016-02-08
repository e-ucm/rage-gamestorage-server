'use strict';

/**
 * This file exports two objects ('defaultValues' and 'testValues') with the information needed to
 * create the 'config.js' and 'config-test.js' files, as specified in the file 'setup.js'.
 *
 * config.js is used in when we are not performing tests over the application ('npm start').
 * config-test.js is used when the tests are launched ('npm test').
 *
 * For more information about the configuration files, take a lok at 'setup.js' to see how generates
 * the files from the 'config-example.js' file.
 *
 * The following values are needed for the configuration.
 *
 * @param projectName - Used in the 'subject' of the emails received (contact form) or sent (password reset).
 * @param companyName -
 * @param mongoHost - Used to build 'mongodbUrl'
 * @param mongoPort - Used to build 'mongodbUrl'
 * @param mongodbUrl - Note that this value mustn't be the same in 'defaultValues' and 'testValues'.
 * @param apiPath - prefix for the REST API requests.
 * @param port - port to listen to.
 */

/**
 * Initializes 'conf' properties with values read from the environment.
 * The environment values must have the following format:
 *      'prefix' + 'conf.propertyKey'
 *          or
 *      'prefix' + 'conf.propertyKey.toUpperCase()'
 *
 * 'links' is an array with values that, when appended '_PORT', can be found in the environment.
 * Is useful for a faster parse of some values such as mongo's host/port.
 *
 * @param conf
 * @param prefix
 * @param links
 */
function initFromEnv(conf, prefix, links) {

    for (var item in conf) {
        var envItem = process.env[prefix + item];
        if (!envItem) {
            envItem = process.env[prefix + item.toUpperCase()];
        }
        if (envItem) {
            conf[item] = envItem;
        }
    }

    links.forEach(function (link) {
        var linkPort = process.env[link.toUpperCase() + '_PORT'];
        if (linkPort) {
            /*
             We want to end up with:
             conf.mongoHost = 172.17.0.15;
             conf.mongoPort = 27017;
             Starting with values like this:
             MONGO_PORT=tcp://172.17.0.15:27017
             */
            var values = linkPort.split('://');
            if (values.length === 2) {
                values = values[1].split(':');
                if (values.length === 2) {
                    conf[link + 'Host'] = values[0];
                    conf[link + 'Port'] = values[1];
                }
            }
        }
    });
}

exports.defaultValues = {
    projectName: 'Rage Game Storage Server',
    companyName: 'e-UCM Research Group',
    mongoHost: 'localhost',
    mongoPort: '27017',
    mongodbUrl: 'mongodb://localhost:27017/rage-gamestorage',
    apiPath: '/api',
    port: 3400,
    a2Host: 'localhost',
    a2Port: '3000',
    a2Prefix: 'gamestorage',
    a2HomePage: 'http://localhost:3000/',
    a2ApiPath: 'http://localhost:3000/api/',
    a2AdminUsername: 'root',
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    a2AdminPassword: process.env.A2_rootPassword || (process.env.A2_ROOTPASSWORD || 'root'),
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    myHost: process.env.MY_HOST || 'localhost'
};

exports.testValues = {
    projectName: 'rage-gamestorage-test (Test)',
    companyName: 'e-UCM Research Group (Test)',
    mongoHost: 'localhost',
    mongoPort: '27017',
    mongodbUrl: 'mongodb://localhost:27017/rage-gamestorage-test', // This must be different than 'exports.defaultValues.mongodbUrl'
    apiPath: '/api',
    port: 3440,
    a2Host: 'localhost',
    a2Port: '3000',
    a2Prefix: 'gamestorage',
    a2HomePage: 'http://localhost:3000/',
    a2ApiPath: 'http://localhost:3000/api/',
    a2AdminUsername: 'root',
    a2AdminPassword: 'root',
    myHost: process.env.MY_HOST || 'localhost'
};

var prefix = 'RAGE_GAMESTORAGE_';
var links = ['mongo', 'a2'];
initFromEnv(exports.defaultValues, prefix, links);
initFromEnv(exports.testValues, prefix, links);

// Some control instructions

// Ensuring that 'mongodbUrl' values are different
exports.defaultValues.mongodbUrl = 'mongodb://' + exports.defaultValues.mongoHost + ':' + exports.defaultValues.mongoPort + '/rage-gamestorage';
exports.testValues.mongodbUrl = exports.defaultValues.mongodbUrl + '-test';

exports.defaultValues.a2HomePage = 'http://' + exports.defaultValues.a2Host + ':' + exports.defaultValues.a2Port + '/';
exports.defaultValues.a2ApiPath = exports.defaultValues.a2HomePage + 'api/';
exports.testValues.a2ApiPath = exports.defaultValues.a2ApiPath;
exports.testValues.a2HomePage = exports.defaultValues.a2HomePage;
exports.testValues.a2AdminUsername = exports.defaultValues.a2AdminUsername;
exports.testValues.a2AdminPassword = exports.defaultValues.a2AdminPassword;