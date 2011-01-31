var events = require('events');

module.exports = BackplanePoller;

function BackplanePoller(){
    events.EventEmitter.call(this);
}

BackplanePoller.prototype = Object.create(events.EventEmitter.prototype);



////Section for polling Echo backplane server
//var google = http.createClient(443, 'api.js-kit.com', true);
//setInterval(function(){
//    var request = google.request('GET', '/v1/bus/digitalbutter', {
//        'host': 'api.js-kit.com',
//        'authorization': 'Basic ZGlnaXRhbGJ1dHRlcjo1YWZmMzdiYWE1NzM3YzM1NzQwNjY1MzA5ZjA5YmM2Zg=='
//    });
//    request.end();
//    request.on('response', function (response) {
//        console.log('STATUS: ' + response.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(response.headers));
//        response.setEncoding('utf8');
//        response.on('data', function (chunk) {
//            console.log('BODY: ' + chunk);
//        });
//    });
//}, 100);
