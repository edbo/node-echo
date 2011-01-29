var utils = require('./../utils.js');
var echo = require('./echo.js');

//Class
var EchoConnector = function(options){
    var self = this;

    //Get required options
    if(!options || !options.consumerKey)throwOptionsException();
    self.consumerKey = options.consumerKey;

    //Set defaults
    self.apiUrl = 'https://api.echoenabled.com/v1/';

    //Parse the options object
    utils.mergeOptions(this,['oAuthHandler'],options);
};

function throwOptionsException(){
  throw { name: "Echo: Option not set exception", message: "EchoConnector requires the consumerKey option to be defined" };
}

EchoConnector.prototype.oAuthHandler = {
    post: function(data){
        throw { name: "Echo: Option not set exception", message: "Echo needs a oAuthHandler with a post function" }
    }
};

EchoConnector.prototype.submit = function(data){
    this.oAuthHandler(this.apiUrl + 'submit', this.consumerKey,"", data, this.responseHandler);
};

module.exports = EchoConnector;
