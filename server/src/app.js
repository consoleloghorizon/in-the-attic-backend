import { APPLICATION_PORT, HOST_APPLICATION_PATH, MAX_PLAYERS } from './util/constants';
import Socket from 'socket.io';
import express from 'express';
import { GameStorage } from './storage/gameStorage';
import cors from 'cors';
const path = require('path');

const app = express();
app.use(cors());
const gameDriver = new GameStorage(MAX_PLAYERS);

app.use(cors())

app.use(express.static(path.join(__dirname, '/templates/build')))

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname+'/templates/build/index.html'));
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
        if (gameDriver.spaceAvailable(gameCode)){
            if(gameDriver.usernameAvailable(gameCode, username)) {
                return res.status(200).json({status: "success"});
            }
            return res.status(300).json({status: "Username used."}); 
        }
        return res.status(300).json({status: "Room is full."});
    }
    return res.status(404).json({status: "Room not found."});
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
        console.log(data);
        client.join(data.gameCode);
        const player = gameDriver.initPlayerInRoom(data.gameCode, data.username, client.id);
        console.log(client.id);
        console.log(player);
        client.emit('player joined game', {isVIP: player.isVIP});
    });

    client.on('phase over', data => {
        console.log("I have been reached");
        console.log("data", data.gameCode);
        io.sockets.to(data.gameCode).emit('phase over', "new phase coming soon");
    });

    client.on('start timer', data => {
        const phaseInfo = gameDriver.getRoom(data.gameCode).getPhaseInfo();
        gameDriver.getRoom(data.gameCode).startAcceptingAnswers();
        io.sockets.in(data.gameCode).emit('start phase', { phaseInfo: phaseInfo });
    });

    client.on('response submission', data => {
        gameDriver.getRoom(data.gameCode).acceptAnswer(client.id, data.answer)
        io.sockets.in(data.gameCode).emit('submission recieved');
    })

    client.on('disconnect', () => {
        console.log("player has left the game");
    });
});