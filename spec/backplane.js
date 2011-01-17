var sys = require('sys');

var MockRequest = function(encoded){
    this.headers = {
        authentication: encoded
    };
};

MockRequest.prototype.addListener = function(){};

var MockResponse = function(){
};

MockResponse.prototype.writeHead = function(){};
MockResponse.prototype.end = function(){};

describe('backplane', function(){
    var backplane = require('backplane.js');

    describe("handler", function(){
        var origAuth, origDecoder, origMessageStore;

        beforeEach(function(){
            origAuth = backplane.authHandler;
            origDecoder = backplane.decode64Handler;
            origMessageStore = backplane.messageStore;
        });

        afterEach(function(){
            backplane.authHandler = origAuth;
            backplane.decode64Handler = origDecoder;
            backplane.messageStore = origMessageStore;
        });

        it("should save the options", function(){
            backplane.handler({authHandler: 'authHandler', decode64Handler: 'decoder', messageStore: 'store'});

            expect(backplane.authHandler).toEqual('authHandler');
            expect(backplane.decode64Handler).toEqual('decoder');
            expect(backplane.messageStore).toEqual('store');
        });

        describe("channel",function(){
            var handler, req, res;

            beforeEach(function(){
                handler = backplane.handler({});
                req = new MockRequest();
                res = new MockResponse();
                spyOn(req,'addListener');
                spyOn(res,'writeHead');
                spyOn(res,'end');
            });

            describe("POST request",function(){
                beforeEach(function(){
                    req.method = "POST";
                    spyOn(backplane,'validate').andReturn(true);
                    handler(req,res);
                });

                it('should use processPost for the data event',function(){

                });
            });

            describe("GET request",function(){
                beforeEach(function(){
                    req.method = "GET";
                    handler(req,res);
                });

                it("should write 200 and content type to head",function(){
                    expect(res.writeHead).toHaveBeenCalledWith(200,{"Content-Type": "text/plain"})
                });

                it("should call write end",function(){
                    expect(res.end).toHaveBeenCalled();
                });
            });
        });
    });

    describe('validate', function(){
        beforeEach(function(){
            spyOn(backplane, 'decode64Handler').andReturn('valid_bus:valid_key');
        });

        describe("with valid key",function(){
            var result;

            beforeEach(function(){
                spyOn(backplane, 'authHandler').andReturn(true);
                result = backplane.validate(new MockRequest('Basic valid_bus:valid_key'));
            });

            it('should call authenticationHandler with passed key',function(){
                expect(backplane.authHandler).toHaveBeenCalledWith('valid_bus','valid_key');
            });

            it('should return true',function(){
                expect(result).toBeTruthy();
            });

            it('should call the decode64Handler',function(){
                expect(backplane.decode64Handler).toHaveBeenCalled();
            });
        });

        describe("with invalid key",function(){
            var result;

            beforeEach(function(){
                spyOn(backplane, 'authHandler').andReturn(false);
                result = backplane.validate(new MockRequest('Basic valid_bus:invalid_key'));
            });

            it('should return false',function(){
                expect(result).toBeFalsy();
            });
        });

        it('should throw exception if header isn not correct',function(){
            var result;
            try
            {
                backplane.validate = backplane.validate(new MockRequest('NotBasic valid_bus:valid_key'));
            }
            catch(err)
            {
                result = err;
            }

            expect(result.name).toEqual("AuthenticationException");
            expect(result.message).toEqual("The backplane library only supports basic Authentication.");
        });
    });

    describe("postEnd", function(){
        var res, callback;

        beforeEach(function(){
            res = new MockResponse();
            req = new MockRequest();
            req.content = "valid_message";
            spyOn(backplane.messageStore,'store');
            spyOn(res,'writeHead');
            spyOn(res,'end');
            callback = backplane.postEnd(req,res,'valid_bus','valid_channel');
        });

        it("should return a callback",function(){
            expect(typeof callback).toEqual('function');
        });

        describe("callback", function(){
            var req;
            beforeEach(function(){
                callback();
            });

            it("should write 200 and content type to head",function(){
                expect(res.writeHead).toHaveBeenCalledWith(200,{"Content-Type": "text/plain"})
            });

            it("should call write end",function(){
                expect(res.end).toHaveBeenCalled();
            });

            it('should save new message to messageStore',function(){
                expect(backplane.messageStore.store).toHaveBeenCalledWith('valid_bus','valid_channel','valid_message');
            });
        });
    });
});