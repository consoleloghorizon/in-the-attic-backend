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
<<<<<<< HEAD
        io.sockets.emit('game-status', {status: true});
=======
        io.sockets.emit('start game', {status: true});
            
>>>>>>> e6a15490bc6b87951754cc6ccc91903d585b90e8
    });

    client.on('add host', data => {
        gameDriver.getRoom(data.gameCode).setHost(client.id);
        client.join(data.gameCode);
    });

    // Needs to be updated to allow to players to reconnect to game
    // and things about active game connects needs to be talked about
    client.on('join game', data => {
        client.join(data.gameCode);
        const player = gameDriver.initPlayerInRoom(data.gameCode, data.username, client.id);
        client.emit('player joined game', {isVIP: player.isVIP});
        const host = gameDriver.getRoom(data.gameCode).getHost();
        io.sockets.to(host).emit('player joined game', {player});
    });

    client.on('phase over', data => {
        gameDriver.getRoom(data.gameCode).stopAcceptingAnswers();
        gameDriver.getRoom(data.gameCode).resolvePhase();
        io.sockets.to(data.gameCode).emit('phase over', "new phase coming soon");
    });

    client.on('start timer', data => {
        gameDriver.getRoom(data.gameCode).startAcceptingAnswers();
        const players = gameDriver.getPlayerList();

        Object.keys(players).forEach(playerKey => {
            const phaseInfo = gameDriver.getRoom(data.gameCode).getPhaseInfo(playerKey);
            io.sockets.to(playerKey).emit('start phase', { phaseInfo });
        });
    });

    client.on('response submission', data => {
        console.log(data);
        try {
            gameDriver.getRoom(data.gameCode).acceptAnswer(client.id, data.answer);
            client.emit('submission success', { isTrue: true });
            const host = gameDriver.getRoom(data.gameCode).getHost();
            const player = gameDriver.getPlayerList()[client.id];
<<<<<<< HEAD
            io.sockets.to(host).emit('submission success', {isTrue: true, Player: player});

            // Added for debugging purposes, TAKE OUT
            gameDriver.getRoom(data.gameCode).resolvePhase();
            gameDriver.getRoom(data.gameCode).startPhase();
            const phaseInfo = gameDriver.getRoom(data.gameCode).getPhaseInfo();
            gameDriver.getRoom(data.gameCode).startAcceptingAnswers();
            io.sockets.in(data.gameCode).emit('start phase', { phaseInfo: phaseInfo });
=======
            io.sockets.to(host).emit('submission success', {isTrue: true, player});

>>>>>>> e6a15490bc6b87951754cc6ccc91903d585b90e8
        } catch (error) {
            client.emit('submission success', { isTrue: false, error: "Something went wrong, submit again" });
        }
    })

    client.on('disconnect', () => {
        console.log("player has left the game");
    });
});