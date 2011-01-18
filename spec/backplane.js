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

        var callback;

        beforeEach(function(){
            //callback = backplane.handler();
        });

        describe("options",function(){
            beforeEach(function(){
                origAuth = backplane.authHandler;
                origDecoder = backplane.decode64Handler;
                origMessageStore = backplane.messageStore;

                backplane.handler({authHandler: 'authHandler', decode64Handler: 'decoder', messageStore: 'store'});
            });

            afterEach(function(){
                backplane.authHandler = origAuth;
                backplane.decode64Handler = origDecoder;
                backplane.messageStore = origMessageStore;
            });

            it("should save the options", function(){
                expect(backplane.authHandler).toEqual('authHandler');
                expect(backplane.decode64Handler).toEqual('decoder');
                expect(backplane.messageStore).toEqual('store');
            });
        });

//        describe("channel",function(){
//            var handler, req, res;
//
//            beforeEach(function(){
//                handler = backplane.handler({});
//                req = new MockRequest();
//                res = new MockResponse();
//                spyOn(req,'addListener');
//                spyOn(res,'writeHead');
//                spyOn(res,'end');
//            });
//
//            describe("POST request",function(){
//                beforeEach(function(){
//                    req.method = "POST";
//                    spyOn(backplane,'validate').andReturn(true);
//                    handler(req,res);
//                });
//
//                it('should use processPost for the data event',function(){
//                    expect(req.addListener).toHaveBeenCalledWith('data',backplane.processPost);
//                });
//
//                it('should use postEnd for the end event',function(){
//                    expect(req.addListener).toHaveBeenCalledWith('end',backplane.postEnd);
//                });
//            });
//
//            describe("GET request",function(){
//                beforeEach(function(){
//                    req.method = "GET";
//                    spyOn(backplane.messageStore,'getChannelMessages')
//                            .andCallFake(function(input){
//                        if(input === "valid_channel"){
//                            return [{ message: { x: 1 }, channel_name: "valid_channel" }
//                                ,{ message: { x: 2 }, channel_name: "valid_channel" }];
//                        }
//                    });
//                    handler(req,res);
//                });
//
//                it("should write 200 and content type to head",function(){
//                    expect(res.writeHead).toHaveBeenCalledWith(200,{"Content-Type": "application/json"})
//                });
//
//                it("should call write end",function(){
//                    expect(res.end).toHaveBeenCalledWith([{ message: { x: 1 }, channel_name: "valid_channel" }
//                        ,{ message: { x: 2 }, channel_name: "valid_channel" }]);
//                });
//            });
//        });
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

    describe('processPost',function(){
        var callback, req;

        beforeEach(function(){
            req = new MockRequest();
            callback = backplane.processPost(req);
        });

        it('should return a callback function',function(){
            expect(typeof callback).toEqual('function');
        });

        describe("call callback once", function(){
            beforeEach(function(){
                callback('first_chunk');
            });

            it('should return the input string',function(){
                expect(req.content).toEqual('first_chunk');
            });

            describe("call the callback twice", function(){
                beforeEach(function(){
                    callback(',second_chunk');
                });

                it("should concatenate the chunks", function(){
                    expect(req.content).toEqual('first_chunk,second_chunk')
                });
            });

        });

    });

    describe("postEnd", function(){
        var res, callback, req;

        beforeEach(function(){
            res = new MockResponse();
            req = new MockRequest();
            req.content = "valid_message";
            spyOn(backplane.messageStore,'save');
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
                expect(backplane.messageStore.save).toHaveBeenCalledWith('valid_bus','valid_channel','valid_message');
            });
        });
    });

    describe("setOptions", function(){
        var objectToSet, acceptable, newOptions,result;

        beforeEach(function(){
            objectToSet = {
                option1: function() { return 'default1'; }
                ,option2: function(){ return 'default2'; }
            };
            acceptable = [ 'option1', 'option2' ];
        });

        describe("with undefined",function(){
            beforeEach(function(){
                newOptions = undefined;
                backplane.mergeOptions(objectToSet, acceptable, newOptions);
            });

            it("should leave original object if newOptions is undefined", function(acceptableOptions,newOptions){
                expect(objectToSet.option1()).toEqual('default1');
                expect(objectToSet.option2()).toEqual('default2');
            });
        });

        describe("with null",function(){
            beforeEach(function(){
                newOptions = null;
                backplane.mergeOptions(objectToSet, acceptable, newOptions);
            });

            it("should leave original object if newOptions is undefined", function(acceptableOptions,newOptions){
                expect(objectToSet.option1()).toEqual('default1');
                expect(objectToSet.option2()).toEqual('default2');
            });
        });

        describe("with one acceptable override",function(){
            beforeEach(function(){
                newOptions = {
                    option1: function(){ return 'new1'; }
                };
                backplane.mergeOptions(objectToSet,acceptable,newOptions);
            });

            it('should overwrite option',function(){
                expect(objectToSet.option1()).toEqual('new1');
            });

            it('should not overwrite the other option',function(){
                expect(objectToSet.option2()).toEqual('default2');
            });
        });

        describe("with two acceptable and one unacceptable function options", function(){
            beforeEach(function(){
                newOptions = {
                    option1: function(){ return 'new1'; }
                    ,option2: function(){ return 'new2'; }
                    ,invalidOption3: function() { return 'new3'; }
                };
                backplane.mergeOptions(objectToSet,acceptable,newOptions);
            });

            it("should set the acceptable options", function(){
                expect(objectToSet.option1()).toEqual('new1');
                expect(objectToSet.option2()).toEqual('new2');
            });

            it("should ignore the unacceptable option",function(){
                expect(objectToSet.invalidOption3).toEqual(undefined);
            });
        });
    });
});