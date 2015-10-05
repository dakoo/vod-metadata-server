var config = require('./manifest.json');
var Hapi = require('hapi');

var server = new Hapi.Server();
for(var i in config){
    server.connection(config[i]);
}

server.register([{
    register: require('./plugins/route')
    },{
    register: require('hapi-mongodb'),
    options: require('./dbconfig.json')
    },{
    register: require('./plugins/vod-file-handler'),       
    options: require('./vodconfig.json')
    }
    ], function (err) {
    if (err) {
        console.log('Failed loading plugin');
    }
    server.start(function() {
        for(var i in config){
            console.log('Server started at ' + config[i].port + ' for ' + config[i].labels[0]);
        }
    });
});
