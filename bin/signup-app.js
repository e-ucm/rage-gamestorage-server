/*
 * Copyright 2016 e-UCM (http://www.e-ucm.es/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * This project has received funding from the European Union’s Horizon
 * 2020 research and innovation programme under grant agreement No 644187.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0 (link is external)
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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


