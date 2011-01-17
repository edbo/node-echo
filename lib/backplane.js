module.exports = (function(){
    var my = {};

    //Interfaces for objects that need to be set
    my.authHandler = function(username,password){
        throw {
            name: "Echo: Option not set exception"
            ,message: "Backplane needs an authentication callback to function."
        }
    };

    my.decode64Handler = function(encodedString){
        throw {
            name: "Echo: Option not set exception"
            ,message: "Backplane needs a base64 decoder to function."
        }
    };

    my.messageStore = {
        store: function(){
            throw {
                name: "Echo: Option not set exception"
                ,message: "Backplane needs a messageStore with a store function."
            }
        }
    };

    my.connect = function(){
        return function(req,res,next) {
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

    my.okResponse = function(res){
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end();
    };

    my.postEnd = function(request,response,bus,channel){
        var res = response;

        return function(){
            my.messageStore.store(bus,channel,request.content);
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end();
        }
    };

    my.handler = function(options){
        my.authHandler = options.authHandler;
        my.decode64Handler = options.decode64Handler;
        my.messageStore = options.messageStore;

        return function(req,res){
            //var paths = require('url').parse(req.url).pathname.split('/');
            //var bus = paths[2], channel = [4];

            switch(req.method){
                case "GET":
                    my.okResponse(res);
                    break;
                case "POST":
                    if(my.validate(req)){

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

    return my;
})();
