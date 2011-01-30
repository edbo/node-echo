var sys = require('sys');
var fs = require('fs');

module.exports = (function(){
    var my = {};

    my.templateCache = {};

    my.responseHandler = function(error,data){
        if(error) console.log(sys.inspect(error));
        else console.log(data);
    };

    my.getFileCallback = function (filename,callback){
        var _filename = filename,
                _callback = callback;

        return function(error,data){
            if(error)_callback(error);
            else{
                my.templateCache[_filename] = data;
                _callback(null,data);
            }
        };
    };

    my.renderTemplate = function(data, callback){
        var filename = 'templates/template.xml';

        if(my.templateCache[filename]){

        }
        else {
            fs.readFile(filename,my.getFileCallback(filename));
        }
    };

    return my;
})();
