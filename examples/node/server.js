var crypto = require('crypto'),
        fs = require('fs'),
        http = require('http');

var base64 = require('base64');

var sys = require('sys');

var echo = require('echo');

var port = 8001;

var privateKey = fs.readFileSync('privatekey.pem').toString(),
        certificate = fs.readFileSync('certificate.pem').toString();

var credentials = crypto.createCredentials({key: privateKey, cert: certificate});

var authenticationHandler = function(username,password){
    return username === 'valid_bus' && password === 'valid_key';
};

//Setup the backplaneHandler
var backplaneHandler = echo.backplaneHandler({ authHandler: authenticationHandler, decode64Handler: base64.decode });

var handler = function(req,res){
    //Catch exceptions to return appropriate responses
    try{
        backplaneHandler(req,res);
    }
    catch(err){
        console.log(err.message);
        if(err.name === 'AuthenticationException'){
            res.writeHead(401, {"Content-Type": "text/plain"});
            res.end("");
        }
        else throw err;
    }
};

var server = http.createServer();
server.setSecure(credentials);
server.addListener("request", handler);
server.listen(port);
console.log("Listening on port: " + port);