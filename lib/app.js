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

var path = require('path');

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
var gameDriver = new _gameStorage.GameStorage(_constants.MAX_PLAYERS);

app.use((0, _cors2.default)());

app.use(_express2.default.static(path.join(__dirname, '/templates/build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/templates/build/index.html'));
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

app.get('/startphase/:gameCode', function (req, res) {
    var gameCode = req.params.gameCode;


    gameDriver.getRoom(data.gameCode).startPhase();
    var phaseInfo = gameDriver.getRoom(data.gameCode).getPhaseInfo();

    return res.status(200).json({ phaseInfo: phaseInfo });
});

var server = app.listen(_constants.APPLICATION_PORT, function () {
    return console.log('In the Attic Server listening on port ' + _constants.APPLICATION_PORT);
});
var io = new _socket2.default(server);

io.on('connection', function (client) {

    client.on('init game', function (data) {
        gameDriver.getRoom(data.gameCode).startGame();
        io.sockets.emit('start game', { status: true });

        // Added for debugging purposes, TAKE OUT
        // If not game will start on VIP's startgame function
        gameDriver.getRoom(data.gameCode).startPhase();
        var phaseInfo = gameDriver.getRoom(data.gameCode).getPhaseInfo();
        gameDriver.getRoom(data.gameCode).startAcceptingAnswers();
        io.sockets.in(data.gameCode).emit('start phase', { phaseInfo: phaseInfo });
    });

    client.on('add host', function (data) {
        gameDriver.getRoom(data.gameCode).setHost(client.id);
        client.join(data.gameCode);
    });

    // Needs to be updated to allow to players to reconnect to game
    // and things about active game connects needs to be talked about
    client.on('join game', function (data) {
        client.join(data.gameCode);
        var player = gameDriver.initPlayerInRoom(data.gameCode, data.username, client.id);
        client.emit('player joined game', { isVIP: player.isVIP });
        var host = gameDriver.getRoom(data.gameCode).getHost();
        io.sockets.to(host).emit('player joined game', { player: player });
    });

    client.on('phase over', function (data) {
        io.sockets.to(data.gameCode).emit('phase over', "new phase coming soon");
    });

    client.on('start timer', function (data) {
        gameDriver.getRoom(data.gameCode).startAcceptingAnswers();
        var players = gameDriver.getPlayerList();

        Object.keys(players).forEach(function (playerKey) {
            var phaseInfo = gameDriver.getRoom(data.gameCode).getPhaseInfo(playerKey);
            io.sockets.to(playerKey).emit('start phase', { phaseInfo: phaseInfo });
        });
    });

    client.on('response submission', function (data) {
        console.log(data);
        try {
            gameDriver.getRoom(data.gameCode).acceptAnswer(client.id, data.answer);
            client.emit('submission success', { isTrue: true });
            var host = gameDriver.getRoom(data.gameCode).getHost();
            var player = gameDriver.getPlayerList()[client.id];
            io.sockets.to(host).emit('submission success', { isTrue: true, Player: player });

            // Added for debugging purposes, TAKE OUT
            gameDriver.getRoom(data.gameCode).resolvePhase();
            gameDriver.getRoom(data.gameCode).startPhase();
            var phaseInfo = gameDriver.getRoom(data.gameCode).getPhaseInfo();
            gameDriver.getRoom(data.gameCode).startAcceptingAnswers();
            io.sockets.in(data.gameCode).emit('start phase', { phaseInfo: phaseInfo });
        } catch (error) {
            client.emit('submission success', { isTrue: false, error: "Something went wrong, submit again" });
        }
    });

    client.on('disconnect', function () {
        console.log("player has left the game");
    });
});