var utils = require('utils.js');
var sha1 = require('echo/sha1.js');

var apiHost = 'api.js-kit.com';

describe("EchoConnector Class", function(){
    var EchoConnector = require('echo/EchoConnector.js');

    describe("constructor with valid properties", function(){
        var echoConn;

        beforeEach(function(){
            spyOn(utils,'mergeOptions');
            echoConn = new EchoConnector({consumerKey: "I am a key",consumerSecret: "I am a secret"});
        });

        it("should set apiUrl to a default value", function(){
            expect(echoConn.apiHost).toEqual(apiHost);
        });

        it("should set consumerKey to the passed value",function(){
            expect(echoConn.consumerKey).toEqual("I am a key");
        });

        describe("submit function",function(){
            beforeEach(function(){
                echoConn.consumerKey = "my key";
                spyOn(echoConn,'post');
                echoConn.submitComment("I am data");
            });

            it("should call the send request function",function(){
                expect(echoConn.post).toHaveBeenCalled();
            });
        });

        describe("usersUpdate", function(){
            beforeEach(function(){
                echoConn.consumerKey = "my key";
                echoConn.usersUpdate("http://user","subject ","content, otherContent","I am data");
            });

            it("should send the data using the oAuthHandler", function(){
                //expect(echoConn.oAuthHandler.post).toHaveBeenCalledWith(apiUrl + 'users/update?id=http%3A%2F%2Fuser&subject=subject%20&content=content%2C%20otherContent', "my key","","I am data",echoConn.responseHandler)
            });
        });

        describe("post function",function(){
            beforeEach(function(){
                echoConn.consumerKey = "consumer key";
                echoConn.consumerSecret = "secret";
                spyOn(sha1,'signRequest');
                echoConn.post("url","I am data");
            });

            it("should get the signed string from the sha1 signRequest function",function(){
                expect(sha1.signRequest).toHaveBeenCalledWith("POST","http://" + apiHost + "url","consumer key","secret","I am data");
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
                new EchoConnector({consumerSecret: "I am a secret"});
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

    describe("constructor missing secret", function(){
        var excp;

        beforeEach(function(){
            try{
                new EchoConnector({consumerKey: "I am a key"});
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
