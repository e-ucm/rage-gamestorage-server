#!/usr/bin/env node
'use strict';

/**
 * This file issues the needed requests to set up the gleaner application
 * with the roles defined in the 'a-gamestorage-routes.js' file.
 *
 */

var Path = require('path');
var request = require('request');
var config = require(Path.resolve(__dirname, '../config.js'));
var appData = require(Path.resolve(__dirname, '../a-gamestorage-routes.js')).app;

var baseUsersAPI = config.a2.a2ApiPath;

// Some messages
var MONGODB_CONNECTION_REFUSED = 'Could not connect to MongoDB!';
var NOT_REGISTERED_ASSET_MSG = 'Did not register the gamestorage asset with A2, continuing anyway!';

request.post(baseUsersAPI + 'login', {
        form: {
            username: config.a2.a2AdminUsername,
            password: config.a2.a2AdminPassword
        },
        json: true
    },
    function (err, httpResponse, body) {
        if (err) {
            console.error(err);
            if (err.errno && err.errno.indexOf('ECONNREFUSED') > -1) {
                console.error(MONGODB_CONNECTION_REFUSED);
                return process.exit(-1);
            }
            console.log(NOT_REGISTERED_ASSET_MSG);
            return process.exit(0);
        }

        appData.name = config.projectName;
        appData.prefix =  config.a2.a2Prefix;
        appData.host = 'http://' + config.myHost + ':' + config.port + config.apiPath;

        request({
            uri: baseUsersAPI + 'applications',
            method: 'POST',
            body: appData,
            json: true,
            headers: {
                Authorization: 'Bearer ' + body.user.token
            }
        }, function (err, httpResponse, body) {
            if (err) {
                console.error(err);
                if (err.errno && err.errno.indexOf('ECONNREFUSED') > -1) {
                    console.error(MONGODB_CONNECTION_REFUSED);
                    return process.exit(-1);
                }
                console.log(NOT_REGISTERED_ASSET_MSG);
                return process.exit(0);
            }

            if (body.message) {
                console.error('Error', body.message,
                    NOT_REGISTERED_ASSET_MSG);
            } else {
                console.log('Game Storage application and routes setup complete.');
            }

            process.exit(0);
        });
    });


