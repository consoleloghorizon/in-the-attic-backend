import openSocket from 'socket.io-client';
export default class Socket{
    constructor(username, gamecode){
        this.socket = openSocket('http://localhost:3000');
        this.socket.emit('join game', { gameCode: gamecode, username: username});
    }

    joinGame(callback) {
        this.socket.on('player joined game', data => {
            callback(data);
        });
    };

    startGame(roomCode) {
        this.socket.emit('init game', {gameCode: roomCode});
    }

    gameIsStarting(callback){
        this.socket.on('start game', data => {
            callback(data);
        })
    }

    sendInfo(info){
        this.socket.emit('response submission', info);
    }

    subscribeToPhaseChange = (callback) => {
        this.socket.on('phase over', data => {
            console.log('phase game data', data);
            callback(data);
        });
    };

    sendGameOver = () => {
        this.socket.emit('phase over', "finshed");
    };
}
