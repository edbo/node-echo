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
            spyOn(fs,'readFile').andReturn('template');
            spyOn(echo,'getFileCallback').andReturn('callback');
        });

        describe("with cached template",function(){
            beforeEach(function(){
                spyOn(tmpl,'render').andReturn("Rendered template");
                echo.templateCache['I am a filename'] = 'I am a template';
                echo.renderTemplate("I am a filename","I am data", renderedCallback);
            });

            it("should load the file",function(){
                expect(fs.readFile).not.toHaveBeenCalledWith('templates/template.xml','callback');
            });

            it("should call the tmpl function",function(){
                expect(tmpl.render).toHaveBeenCalledWith('I am a template','I am data');
            });

            it("should call the callback with the rendered template",function(){
                expect(renderedCallback).toHaveBeenCalledWith(null,"Rendered template");
            });
        });

        describe("with non cached template",function(){
            beforeEach(function(){
                echo.templateCache = {};
                echo.renderTemplate("I am the filename","I am template data",renderedCallback);
            });

            it("should pass the filename to the getFileCallback",function(){
                expect(echo.getFileCallback).toHaveBeenCalledWith('I am the filename',"I am template data",renderedCallback);
            });

            it("should load the template file",function(){
                expect(fs.readFile).toHaveBeenCalledWith('I am the filename','utf8','callback');
            });
        });
    });

    describe("getFileCallback", function(){
        var callback,
                readCallback;

        beforeEach(function(){
            readCallback = jasmine.createSpy();
            callback = echo.getFileCallback('filename','I am template data',readCallback);
        });

        it("should return a callback", function(){
            expect(typeof callback).toEqual('function');
        });

        describe("call callback with data", function(){
            beforeEach(function(){
                spyOn(tmpl,'render').andReturn("Rendered template");
                callback(null,"I am a template");
            });

            it("should save the data to the cache", function(){
                expect(echo.templateCache['filename']).toEqual("I am a template");
            });

            it("should call the tmpl function",function(){
                expect(tmpl.render).toHaveBeenCalledWith('I am a template','I am template data');
            });

            it("should call the callback with the rendered template",function(){
                expect(readCallback).toHaveBeenCalledWith(null,"Rendered template");
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
