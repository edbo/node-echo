var utils = require('./../utils.js');
var http = require('http');
var echo = require('./echo.js');
var querystring = require('querystring');
var inspect = require('sys').inspect;

var sha1 = require('./sha1.js');

//Class
var EchoConnector = function(options){
    var self = this;

    //Get required options
    if(!options || !options.consumerKey || !options.consumerSecret)throwOptionsException();
    self.consumerKey = options.consumerKey;
    self.consumerSecret = options.consumerSecret;

    //Set defaults
    self.apiHost = 'api.js-kit.com';
};

function throwOptionsException(){
    throw { name: "Echo: Option not set exception", message: "EchoConnector requires the consumerKey option to be defined" };
}

EchoConnector.prototype.submit = function(data){
    this.post("http://api.js-kit.com/v1/submit",data);

//    var echoApi = http.createClient(80, 'api.js-kit.com');
//
//    //Create data to sign
//    var signedRequest = sign('POST','http://api.js-kit.com/v1/submit',this.consumerKey, this.consumerSecret, { content: data });
//
//    var request = echoApi.request('POST', '/v1/submit',
//    {'host': 'api.js-kit.com', 'Content-Type': 'application/x-www-urlencoded', 'Content-Length': signedRequest.length});
//    request.write(signedRequest);
//    request.on('response', function (response) {
//        console.log('STATUS: ' + response.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(response.headers));
//        response.setEncoding('utf8');
//        response.on('data', function (chunk) {
//            console.log('BODY: ' + chunk);
//        });
//    });
//    request.end();
};

EchoConnector.prototype.usersUpdate = function(id,subject,content,data){
//    var echoApi = http.createClient(80, 'api.js-kit.com');
//
//    //Create data to sign
//    var signedRequest = sign('POST','http://api.js-kit.com/v1/users/update',this.consumerKey, this.consumerSecret, {id: id, subject: subject, content: content});
//
//    var request = echoApi.request('POST', '/v1/users/update',
//    {'host': 'api.js-kit.com', 'Content-Type': 'application/x-www-urlencoded', 'Content-Length': signedRequest.length});
//    request.end(signedRequest);
//    request.on('response', function (response) {
//        console.log('STATUS: ' + response.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(response.headers));
//        response.setEncoding('utf8');
//        response.on('data', function (chunk) {
//            console.log('BODY: ' + chunk);
//        });
//    });
};

EchoConnector.prototype.post = function(url,data){
    var postData = sha1.signRequest("POST",url,this.consumerKey,this.consumerSecret,data);
    postData = sha1.sortIntoString(postData);

    var echoApi = http.createClient(80, 'api.js-kit.com');
    var request = echoApi.request('POST', '/v1/submit',
    {'host': 'api.js-kit.com', 'Content-Type': 'application/x-www-urlencoded', 'Content-Length': postData.length});
    request.end(postData);
    request.on('response', function (response) {
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });
};

EchoConnector.prototype.responseHandler = function(error,data,response){
    console.log("Error: " + inspect(error));
    console.log(data);
    console.log(inspect(response));
};

module.exports = EchoConnector;
