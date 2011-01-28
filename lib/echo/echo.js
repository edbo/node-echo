var sys = require('sys');

exports.responseHandler = function(error,data){
    if(error) console.log(sys.inspect(error));
    else console.log(data);
};