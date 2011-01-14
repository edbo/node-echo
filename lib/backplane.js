exports.connect = function(){
    return function(req,res,next) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("Hello Connect");
    }
};