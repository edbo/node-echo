var sys = require('sys');
var fs = require('fs');

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
        beforeEach(function(){
            spyOn(fs,'readFile').andReturn('template');
            spyOn(echo,'getFileCallback').andReturn('callback');
            echo.renderTemplate();
        });

        it("should pass the filename to the getFileCallback",function(){
            expect(echo.getFileCallback).toHaveBeenCalledWith('templates/template.xml');
        });

        it("should load the template file",function(){
            expect(fs.readFile).toHaveBeenCalledWith('templates/template.xml','callback');
        });

        describe("cache",function(){
            beforeEach(function(){
                echo.renderTemplate();
            });

            it("should load the file",function(){
                expect(fs.readFile).not.toHaveBeenCalledWith('templates/template.xml','callback');
            });
        });
    });
    
    describe("getFileCallback", function(){
        it("should return a callback", function(){
            expect(echo.getFileCallback)
        });
    });
});
