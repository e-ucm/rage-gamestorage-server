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

var request = require('supertest');

var config;
var documentStorage;

describe('API Test', function(done) {

    /**Initialize MongoDB**/
    before(function (done) {
        var app = require('../app');
        config = app.config;
        app.listen(config.port, function (err) {
            if (err) {
                done(err);
            } else {
                request = request(app);
                documentStorage = app.documentStorage;
                // Give it 200ms so that the connection with MongoDB is established.
                setTimeout(function () {
                    done();
                }, 200);
            }
        });
    });

    it('Start tests', function(done) {
        require('./tests/configs');

        require('./tests/health')(request);
        require('./tests/gamestorage-test')(request, documentStorage);
        done();
    });

});

