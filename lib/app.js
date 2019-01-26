'use strict';

var _constants = require('./util/constants');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = new _socket2.default();
var app = (0, _express2.default)();

app.get('/', function (req, res) {
    res.sendFile(__dirname + _constants.HOST_APPLICATION_PATH + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
});

app.listen(_constants.APPLICATION_PORT, function () {
    return console.log('Example app listening on port ' + _constants.APPLICATION_PORT + '!');
});