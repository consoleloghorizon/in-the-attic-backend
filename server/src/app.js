import { APPLICATION_PORT, HOST_APPLICATION_PATH, MAX_PLAYERS } from './util/constants';
import Socket from 'socket.io';
import express from 'express';
import { GameStorage } from './storage/gameStorage';

const app = express();
const gameDriver = new GameStorage(MAX_PLAYERS);

app.get('/', function(req, res){
    // res.sendFile(__dirname + '/templates/index.html');
    res.send('Holding Space');
});

app.get('/start', (req, res) => {
    const gameSetupData = gameDriver.initializeGameRoom();
    res.status(200).json({
        gameCode: gameSetupData.getRoomCode(),
        details: ""
    });
});

app.get('/login/:username/:gameCode', (req, res) => {
    const { username, gameCode } = req.params;
    if (gameDriver.gameRoomExists(gameCode)){
        if (gameDriver.spaceAvailable(gameCode) && gameDriver.usernameAvailable(gameCode, username)) {
            return res.status(200).json({status: "success"});
        } else if (!gameDriver.spaceAvailable(gameCode)) {
            return res.status(200).json({status: "no space available"});
        } else {
            return res.status(200).json({status: "invalid username"});
        }
    }
    else {
        return res.status(200).json({status: "invalid roomcode"});
    } 
});

const server = app.listen(APPLICATION_PORT, () => console.log(`In the Attic Server listening on port ${APPLICATION_PORT}`));
const io = new Socket(server)

io.on('connection', (socket) => {
    socket.on('init game', data, () => {
        io.socket.emit('start game', {status: true})
    });

    socket.on('add host', data => {
        socket.join(data.gameCode);
    });

    socket.on('join game', data => {
        socket.join(data.gameCode);
        gameDriver.initPlayerInRoom(data.gameCode, data.username);
        io.sockets.in(data.gameCode).emit('player joined game', data);
    });

    socket.on('phase over', data=> {
        io.sockets.in(data.gameCode).emit('phase over', data);
    });

    socket.on('phase start', data => {
        io.sockets.in(data.gameCode).emit('start phase', data);
    });

    socket.on('response submission', data => {
        io.sockets.in(data.gameCode).emit('submission recieved');
    })

    socket.on('disconnect', () => {
        console.log("player has left the game");
    });
});