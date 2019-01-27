import { APPLICATION_PORT, HOST_APPLICATION_PATH, MAX_PLAYERS } from './util/constants';
import Socket from 'socket.io';
import express from 'express';
import { GameStorage } from './storage/gameStorage';
import cors from 'cors';

const app = express();
const gameDriver = new GameStorage(MAX_PLAYERS);

app.use(cors())

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

app.get('/startphase/:gameCode', (req, res) => {
    const { gameCode } = req.params;

    gameDriver.getRoom(data.gameCode).startPhase();
    const phaseInfo = gameDriver.getRoom(data.gameCode).getPhaseInfo();

    return res.status(200).json({ phaseInfo: phaseInfo });
});

const server = app.listen(APPLICATION_PORT, () => console.log(`In the Attic Server listening on port ${APPLICATION_PORT}`));
const io = new Socket(server)

io.on('connection', (client) => {
    client.on('init game', data => {
        gameDriver.getRoom(data.gameCode).startGame();
        io.socket.emit('start game', {status: true})
    });

    client.on('add host', data => {
        client.join(data.gameCode);
    });

    client.on('join game', data => {
        client.join(data.gameCode);
        const player = gameDriver.initPlayerInRoom(data.gameCode, data.username);
        io.sockets.in(data.gameCode).emit('player joined game', {isVIP: player.isVIP()});
    });

    client.on('phase over', data => {
        console.log("I have been reached");
        console.log("data", data.gameCode);
        io.sockets.to(data.gameCode).emit('phase over', "new phase coming soon");
        io.sockets.emit('phase over', "new phase coming soon");
    });

    client.on('start timer', data => {
        const phaseInfo = gameDriver.getRoom(data.gameCode).getPhaseInfo();
        gameDriver.getRoom(data.gameCode).startAcceptingAnswers();
        io.sockets.in(data.gameCode).emit('start phase', { phaseInfo: phaseInfo });
    });

    client.on('response submission', data => {
        gameDriver.getRoom(data.gameCode).acceptAnswer(data.username, data.answer)
        io.sockets.in(data.gameCode).emit('submission recieved');
    })

    client.on('disconnect', () => {
        console.log("player has left the game");
    });
});