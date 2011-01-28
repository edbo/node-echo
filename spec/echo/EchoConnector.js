var utils = require('utils.js');

var apiUrl = 'https://api.echoenabled.com/v1/';

describe("EchoConnector Class", function(){
    var EchoConnector = require('echo/EchoConnector.js');

    describe("constructor with valid properties", function(){
        var echoConn;

        beforeEach(function(){
            spyOn(utils,'mergeOptions');
            echoConn = new EchoConnector({consumerKey: "I am a key"});
        });

        it("should call mergeOptions", function(){
            expect(utils.mergeOptions).toHaveBeenCalledWith(echoConn,['oAuthHandler'],{consumerKey: "I am a key"});
        });

        it("should set apiUrl to a default value", function(){
            expect(echoConn.apiUrl).toEqual(apiUrl);
        });

        it("should set consumerKey to the passed value",function(){
            expect(echoConn.consumerKey).toEqual("I am a key");
        });

        describe("submit function",function(){
            beforeEach(function(){
                echoConn.consumerKey = "my key";
                echoConn.responseHandler = function(){};
                spyOn(echoConn,'oAuthHandler');
                echoConn.submit("I am data");
            });

            it("should send the data using the oAuthHandler",function(){
                expect(echoConn.oAuthHandler).toHaveBeenCalledWith(apiUrl + 'submit', "my key","","I am data",echoConn.responseHandler);
            });
        });
    });

    describe("constructor with no options", function(){
        var excp;

        beforeEach(function(){
            try{
                new EchoConnector();
            }
            catch(e){
                excp = e;
            }
        });

        it("should throw and exception", function(){
   		    expect(excp).toBeDefined();
            expect(excp.name).toEqual("Echo: Option not set exception");
            expect(excp.message).toEqual("EchoConnector requires the consumerKey option to be defined");
        });
    });


    describe("constructor missing key", function(){
        var excp;

        beforeEach(function(){
            try{
                new EchoConnector('I am the options');
            }
            catch(e){
                excp = e;
            }
        });

        it("should throw and exception", function(){
   		    expect(excp).toBeDefined();
            expect(excp.name).toEqual("Echo: Option not set exception");
            expect(excp.message).toEqual("EchoConnector requires the consumerKey option to be defined");
        });
    });
});
