'use strict';

exports.port = process.env.PORT || '{{port}}';
exports.myHost = '{{myHost}}';
exports.mongodb = {
    uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || '{{mongodbUrl}}'
};
exports.apiPath = '{{apiPath}}';
exports.companyName = '{{companyName}}';
exports.projectName = '{{projectName}}';
exports.a2 = {
    a2ApiPath: '{{a2ApiPath}}',
    a2Prefix: '{{a2Prefix}}',
    a2HomePage: '{{a2HomePage}}',
    a2AdminUsername: '{{a2AdminUsername}}',
    a2AdminPassword: '{{a2AdminPassword}}'
};