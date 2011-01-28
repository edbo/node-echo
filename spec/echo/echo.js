var sys = require('sys');

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
});
