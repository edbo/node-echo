var sys = require('sys');
var fs = require('fs');

module.exports = (function(){
    var my = {},
            cache = {};

    my.responseHandler = function(error,data){
        if(error) console.log(sys.inspect(error));
        else console.log(data);
    };

    my.getFileCallback = function (filename){

    };

    my.renderTemplate = function(){
        var filename = 'templates/template.xml';

        if(cache[filename]){

        }
        else {
            fs.readFile(filename,exports.getFileCallback(filename));
        }
    };
})();
