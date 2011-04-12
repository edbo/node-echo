var http = require('http');
var querystring = require('querystring');

var utils = require('./../utils.js');
var echo = require('./echo.js');

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


EchoConnector.prototype.submitArticle = function(article,user,target,callback){
    var date = ISODateString(new Date());
    var scope = this;

    article.summary = utils.Encoder.htmlEncode(article.summary,true);
    article.content = utils.Encoder.htmlEncode(article.content,true);
    article.title = utils.Encoder.htmlEncode(article.title,true);

    echo.renderTemplate(__dirname + '/templates/article.xml', { article: article }, function(error,renderedComment){
        if(error)callback(error,"");
        else{
            echo.renderTemplate(__dirname + '/templates/base.xml', {
                verb: 'http://activitystrea.ms/schema/1.0/post',
                feed: {
                    idUrl: 'http://whosjoining.com',
                    updated: date
                },
                entry: {
                    id: article.url,
                    published: date
                },
                actor: {
                    url: user.id
                    ,name: user.name
                    ,avatar: user.avatarURL
                },
                activityObject: renderedComment,
                target: {
                    type: 'article',
                    url: article.url
                }
            }, function(error,renderedMessage){
                if(error)callback(error,"");
                else{

                    require('fs').writeFile('output.xml', renderedMessage, function (err,result) {
                        if(error)callback(error,"");
                        else{
                            scope.post("/v1/submit",{ content: renderedMessage },callback);
                        }
                    });
                }
            });
        }
    });
};

EchoConnector.prototype.submitComment = function(comment,user,callback){
    var date = ISODateString(new Date());
    var scope = this;

    comment.content = utils.Encoder.htmlEncode(comment.content,true);
    comment.subject = utils.Encoder.htmlEncode(comment.subject,true);

    echo.renderTemplate(__dirname + '/templates/comment.xml', { comment: comment }, function(error,renderedComment){
        if(error)callback(error,"");
        else{
            echo.renderTemplate(__dirname + '/templates/base.xml', {
                verb: 'http://activitystrea.ms/schema/1.0/post',
                feed: {
                    idUrl: 'http://whosjoining.com',
                    updated: date
                },
                entry: {
                    id: comment.url,
                    published: date
                },
                actor: {
                    url: user.id
                    ,name: user.name
                    ,avatar: user.avatarURL
                },
                activityObject: renderedComment,
                target: {
                    type: 'article',
                    url: comment.target                             }
            }, function(error,renderedMessage){
                if(error)callback(error,"");
                else{
                    require('fs').writeFile('commentOutput.xml', renderedMessage, function (err,result) {
                        if(error)callback(err,"");
                        else {
                            scope.post("/v1/submit",{ content: renderedMessage },callback);
                        }
                    });
                }
            });
        }
    });
};


EchoConnector.prototype.markComment = function(marker,comment,user,callback){
    var date = ISODateString(new Date());
    var scope = this;

    comment.content = utils.Encoder.htmlEncode(comment.content,true);
    comment.subject = utils.Encoder.htmlEncode(comment.subject,true);

    echo.renderTemplate(__dirname + '/templates/marker.xml', { marker: marker }, function(error,renderedComment){
        if(error)callback(error,"");
        else{
            echo.renderTemplate(__dirname + '/templates/base.xml', {
                verb: 'http://activitystrea.ms/schema/1.0/tag',
                feed: {
                    idUrl: 'http://whosjoining.com',
                    updated: date
                },
                entry: {
                    id: marker.id,
                    published: date
                },
                actor: {
                    url: user.id
                    ,name: user.name
                    ,avatar: user.avatarURL
                },
                activityObject: renderedComment,
                target: {
                    type: 'comment',
                    url: comment.url                             }
            }, function(error,renderedMessage){
                if(error)callback(error,"");
                else{
                    require('fs').writeFile('markerOutput.xml', renderedMessage, function (err,result) {
                        if(error)callback(err,"");
                        else {
                            scope.post("/v1/submit",{ content: renderedMessage },callback);
                        }
                    });
                }
            });
        }
    });
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

EchoConnector.prototype.post = function(url,data,callback){
    var self = this;

    var postData = sha1.signRequest("POST","http://" + self.apiHost + url,this.consumerKey,this.consumerSecret,data);
    postData = sha1.sortIntoString(postData);

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
        response.on('end',callback);
    });
};

EchoConnector.prototype.responseHandler = function(error,data,response){
    console.log("Error: " + inspect(error));
    console.log(data);
    console.log(inspect(response));
};

function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
            + pad(d.getUTCMonth()+1)+'-'
            + pad(d.getUTCDate())+'T'
            + pad(d.getUTCHours())+':'
            + pad(d.getUTCMinutes())+':'
            + pad(d.getUTCSeconds())+'Z'
}

function trimTabs(stringToTrim) {
    return  stringToTrim.replace(/^\r\n|\n|\r|\t+$/gm,"");
}

module.exports = EchoConnector;
