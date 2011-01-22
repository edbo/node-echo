var url = require('url');

module.exports = (function(){
    var my = {};

    //Interfaces for objects that need to be set
    my.authHandler = function(username,password){
        throw { name: "Echo: Option not set exception", message: "Backplane needs an authentication callback to function." }
    };

    my.decode64Handler = function(encodedString){
        throw { name: "Echo: Option not set exception", message: "Backplane needs a base64 decoder to function." }
    };

    my.messageStore = {
        save: function(bus,channel,content){
            throw { name: "Echo: Option not set exception", message: "Backplane needs a messageStore with a save function." }
        }
        //Callback function([ Messages ]){};
        ,getChannelMessages: function(bus, channel,callback){
            throw { name: "Echo: Option not set exception", message: "Backplane needs a messageStore with a getChannelMessages function" }
        }
        ,getBusMessages: function(bus, callback){
            throw { name: "Echo: Option not set exception", message: "Backplane needs a messageStore with a getBusMessages function" }
        }
    };

    //Merge options helper
    my.mergeOptions = function(objectToSet,acceptableOptions,newOptions){
        for(var key in newOptions){
            if(acceptableOptions.indexOf(key) !== -1){
                if(typeof newOptions[key] === 'function'){
                    objectToSet[key] = newOptions[key];
                }
                else if(newOptions[key] instanceof Object){
                    for(var subKey in newOptions[key]){
                        objectToSet[key][subKey] = newOptions[key][subKey];
                    }
                }
            }
        }
    };

    my.validate = function(request){
        //Check it is the Basic HTTP Authentication otherwise throw an exception
        var basicAuthRegex = /^Basic (.*)/;
        var result = basicAuthRegex.exec(request.headers.authentication);
        if(!result) throw {
            name: "AuthenticationException"
            ,message: "The backplane library only supports basic Authentication."
            ,authenticationHeader: request.headers.authentication
        };

        //Check the result with the authentication handler
        var authStr = result[1];
        authStr = my.decode64Handler(authStr).split(':');
        return my.authHandler(authStr[0],authStr[1]);
    };

    my.processGetBus = function(res){
        return function(messageArray){
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(messageArray));
        };
    };

    my.processGetChannel = function(res){
        return function(messageArray){
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(messageArray));
        };
    };

    my.processPost = function(req){
        req.content = "";
        return function(chunk){
            req.content += chunk;
        };
    };

    my.postEnd = function(request,response,bus,channel){
        var res = response;

        return function(){
            my.messageStore.save(bus,channel,request.content);
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end();
        }
    };

    my.handler = function(options){
        my.mergeOptions(my,['authHandler','decode64Handler','messageStore'],options);

        return function(req,res){
            var paths = url.parse(req.url).pathname.split('/');
            var bus = paths[3], channel = paths[5];

            switch(req.method){
                case "GET":
                    if(channel) my.messageStore.getChannelMessages(bus,channel,my.processGetChannel(res));
                    else my.messageStore.getBusMessages(bus,my.processGetBus(res));
                    break;
                case "POST":
                    if(my.validate(req)){
                        req.addListener('data',my.processPost(req));
                        req.addListener('end',my.postEnd(req,res,bus,channel));
                    }
                    else{
                        res.writeHead(401, {"Content-Type": "text/plain"});
                        res.end("Wrong username and/or password.");
                    }
                    break;
                default:
                    throw "Method Not implemented";
            }
        };
    };

    my.connectHandler = function(options){
        callback = my.handler(options);

        return function(req,res,next) {
            var urlRegex = /^\/v1\/bus\//;
            if(urlRegex.test(req.url)){
                callback(req,res);
            }
            else next();
        }
    };

    return my;
})();
