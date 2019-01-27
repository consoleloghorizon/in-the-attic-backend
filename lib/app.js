'use strict';

var _constants = require('./util/constants');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _gameStorage = require('./storage/gameStorage');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
var gameDriver = new _gameStorage.GameStorage(_constants.MAX_PLAYERS);

app.get('/', function (req, res) {
    // res.sendFile(__dirname + '/templates/index.html');
    res.send('Holding Space');
});

app.get('/start', function (req, res) {
    var gameSetupData = gameDriver.initializeGameRoom();
    res.status(200).json({
        gameCode: gameSetupData.getRoomCode(),
        details: ""
    });
});

app.get('/login/:username/:gameCode', function (req, res) {
    var _req$params = req.params,
        username = _req$params.username,
        gameCode = _req$params.gameCode;

    if (gameDriver.gameRoomExists(gameCode)) {
        if (gameDriver.spaceAvailable(gameCode)) {
            if (gameDriver.usernameAvailable(gameCode, username)) {
                return res.status(200).json({ status: "success" });
            }
            return res.status(300).json({ status: "Username used." });
        }
        return res.status(300).json({ status: "Room is full." });
    }
    return res.status(404).json({ status: "Room not found." });
});

var server = app.listen(_constants.APPLICATION_PORT, function () {
    return console.log('In the Attic Server listening on port ' + _constants.APPLICATION_PORT);
});
var io = new _socket2.default(server);

io.on('connection', function (socket) {
    socket.on('init game', function (data) {
        io.socket.emit('start game', { status: true });
    });

    socket.on('add host', function (data) {
        socket.join(data.gameCode);
    });

    socket.on('join game', function (data) {
        socket.join(data.gameCode);
        gameDriver.initPlayerInRoom(data.gameCode, data.username);
        io.sockets.in(data.gameCode).emit('player joined game', data);
    });

    socket.on('phase over', function (data) {
        io.sockets.in(data.gameCode).emit('phase over', data);
    });

    socket.on('phase start', function (data) {
        io.sockets.in(data.gameCode).emit('start phase', data);
    });

    socket.on('response submission', function (data) {
        io.sockets.in(data.gameCode).emit('submission recieved');
    });

    socket.on('disconnect', function () {
        console.log("player has left the game");
    });
});