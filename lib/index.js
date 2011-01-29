var backplane = require('./backplane/backplane.js');
var messages = require('./backplane/backplaneMessages.js');

exports.EchoConnector = require('./echo/EchoConnector.js');
exports.backplaneConnect = backplane.connectHandler;
exports.backplaneHandler = backplane.handler;
exports.messages = messages;