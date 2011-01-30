var sys = require('sys');
var fs = require('fs');
var tmpl = require('echo/tmpl.js');

describe("echo library", function(){
    var echo = require('echo/echo.js');


    describe("responseHandler function", function(){
        beforeEach(function(){
            spyOn(console,'log');
        });

        describe("with no error", function(){
            beforeEach(function(){
                echo.responseHandler(null,"Response");
            });

            it("should log the response", function(){
                expect(console.log).toHaveBeenCalledWith("Response");
            });
        });

        describe("with error", function(){
            beforeEach(function(){
                spyOn(sys,'inspect').andReturn("inspected error");
                echo.responseHandler({ errorObject: "error value" },"");
            });

            it("should log the response", function(){
                expect(sys.inspect).toHaveBeenCalledWith({ errorObject: "error value" });
                expect(console.log).toHaveBeenCalledWith("inspected error");
            });
        });
    });

    describe("renderTemplate function", function(){
        var renderedCallback;

        beforeEach(function(){
            renderedCallback = jasmine.createSpy();
            spyOn(tmpl,'render').andReturn('Rendered template');
            spyOn(fs,'readFile').andReturn('template');
            spyOn(echo,'getFileCallback').andReturn('callback');
        });

        describe("with cached template",function(){
            beforeEach(function(){
                echo.templateCache['templates/template.xml'] = {};
                echo.renderTemplate("I am template data",renderedCallback);
            });

            it("should load the file",function(){
                expect(fs.readFile).not.toHaveBeenCalledWith('templates/template.xml','callback');
            });

            it("should call the tmpl function",function(){
                expect()
            });
        });

        describe("with non cached template",function(){
            beforeEach(function(){
                echo.templateCache = {};
                echo.renderTemplate("I am template data",renderedCallback);
            });

            it("should pass the filename to the getFileCallback",function(){
                expect(echo.getFileCallback).toHaveBeenCalledWith('templates/template.xml');
            });

            it("should load the template file",function(){
                expect(fs.readFile).toHaveBeenCalledWith('templates/template.xml','callback');
            });
        });
    });

    describe("getFileCallback", function(){
        var callback,
                readCallback;

        beforeEach(function(){
            readCallback = jasmine.createSpy();
            callback = echo.getFileCallback('filename',readCallback);
        });

        it("should return a callback", function(){
            expect(typeof callback).toEqual('function');
        });

        describe("call callback with data", function(){
            beforeEach(function(){
                callback(null,"I am data");
            });

            it("should save the data to the cache", function(){
                expect(echo.templateCache['filename']).toEqual("I am data");
            });

            it("should call the passed in callback",function(){
                expect(readCallback).toHaveBeenCalledWith(null, "I am data");
            });
        });

        describe("call callback with error", function(){
            beforeEach(function(){
                callback({ name: "I am an error" },null);
            });

            it("should pass the error on",function(){
                expect(readCallback).toHaveBeenCalledWith({ name: "I am an error" });
            });
        });
    });
});
