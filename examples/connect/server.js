var connect = require('connect');
var base64 = require('base64');

var echo = require('echo');

var port = 8001;

var authenticationHandler = function(username,password){
    return username === 'valid_bus' && password === 'valid_key';
};

var messageStore = {
    valid_bus: {}
    ,save: function(bus,channel,message){
        console.log('bus:' + bus + " ,channel: " + channel + " ,message: " + message);
        if(!messageStore.valid_bus[channel]) messageStore.valid_bus[channel] = new Array();
        messageStore.valid_bus[channel].push(message);
    }
    ,getChannelMessages: function(channel,callback){
       console.log('getChannel: ' + channel);
       console.log(messageStore.valid_bus[channel]);
       callback(messageStore.valid_bus[channel]);
    }
};

var server = module.exports = connect.createServer(
    connect.logger(),
    echo.backplaneConnect({ authHandler: authenticationHandler, decode64Handler: base64.decode, messageStore: messageStore })
);

server.listen(port);
console.log("Listening on port: " + port);