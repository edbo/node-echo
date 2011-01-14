var crypto = require('crypto'),
    fs = require('fs'),
    connect = require('connect');

var echo = require('echo'),
    backplane = echo.backplane;

var port = 8001;

var privateKey = fs.readFileSync('privatekey.pem').toString(),
    certificate = fs.readFileSync('certificate.pem').toString();

var credentials = crypto.createCredentials({key: privateKey, cert: certificate});

var server = module.exports = connect.createServer(
    connect.logger(),
    backplane.connect()
);

server.setSecure(credentials);
server.listen(port);
console.log("Listening on port: " + port);