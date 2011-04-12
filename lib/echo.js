var sys = require('sys');
var fs = require('fs');
var tmpl = require('./tmpl.js');

module.exports = (function(){
    var my = {};

    my.templateCache = {};

    my.responseHandler = function(error,data){
        if(error) console.log(sys.inspect(error));
        else console.log(data);
    };

    my.getFileCallback = function (filename,templateData,callback){
        return function(error,data){
            if(error)callback(error);
            else{
                my.templateCache[filename] = data;
                var rendered = tmpl.render(my.templateCache[filename],templateData);
                callback(null,rendered);
            }
        };
    };

    my.renderTemplate = function(filename, data, callback){
        if(my.templateCache[filename]){
            callback(null,tmpl.render(my.templateCache[filename],data));
        }
        else {
            fs.readFile(filename,'utf8',my.getFileCallback(filename,data,callback));
        }
    };

    return my;
})();
