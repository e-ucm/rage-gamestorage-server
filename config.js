'use strict';

exports.port = process.env.PORT || '3400';
exports.myHost = 'localhost';
exports.mongodb = {
    uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/rage-gamestorage'
};
exports.apiPath = '/api';
exports.companyName = 'e-UCM Research Group';
exports.projectName = 'Rage Game Storage Server';
exports.a2 = {
    a2ApiPath: 'http://localhost:3000/api/',
    a2Prefix: 'gamestorage',
    a2HomePage: 'http://localhost:3000/',
    a2AdminUsername: 'root',
    a2AdminPassword: 'root'
};