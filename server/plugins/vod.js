var Boom = require('boom');
exports.getlist = function (request, reply) {
    console.log('request');
    var db = request.server.plugins['hapi-mongodb'].db;
    db.collection('streams').find().sort({createDate: -1}).limit(30).toArray(function(err, docs) {
        reply(docs);
    });
};
