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
    this.post("/v1/submit",data);
};

EchoConnector.prototype.usersUpdate = function(id,subject,content){
    this.post("/v1/users/update",{identityURL: id, subject: subject, content: content});
};

EchoConnector.prototype.usersWhoAmI = function(key, sessionId){
    this.get("/v1/users/whoami",{ appkey: key, sessionID: 'http://api.js-kit.com/v1/bus/digitalbutter/channel/' + sessionId})
};

EchoConnector.prototype.usersGet = function(id){
    this.get("/v1/users/get",{identityURL: id});
};

EchoConnector.prototype.get = function(url,data){
    var self = this;

    var postData = sha1.signRequest("GET","http://" + self.apiHost + url,this.consumerKey,this.consumerSecret,data);
    postData = sha1.sortIntoString(postData);

    var echoApi = http.createClient(80, self.apiHost);
    console.log(url + "?" + postData);
    var request = echoApi.request('GET', url + "?" + postData,
    {'host': 'api.js-kit.com', 'Content-Type': 'application/x-www-urlencoded', 'Content-Length': postData.length});
    request.end();
    request.on('response', function (response) {
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });
};

EchoConnector.prototype.post = function(url,data){
    var self = this;

    var postData = sha1.signRequest("POST","http://" + self.apiHost + url,this.consumerKey,this.consumerSecret,data);
    postData = sha1.sortIntoString(postData);

    console.log(postData);
    var echoApi = http.createClient(80, self.apiHost);
    var request = echoApi.request('POST', url,
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
