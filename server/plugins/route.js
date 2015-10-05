var page = require('./page');
var vod = require('./vod');
var apis = [
    { method: 'GET', path: '/', handler: page.front },
    { method: 'GET', path: '/vod', handler: vod.getlist },   
    { method: 'GET', path: '/{filename*}', handler: page.get}];

exports.register = function (server, options, next) {
    server.select("api").route(apis);	//connect the label and the endpoints
    next();
};

exports.register.attributes = {
    name: 'route',
    version: '1.0.0'
};
