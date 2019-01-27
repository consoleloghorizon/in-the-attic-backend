import openSocket from 'socket.io-client';
export default class Socket{
    constructor(username, gamecode){
        this.socket = openSocket('http://3.92.201.176:3000');
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

    sendInfo(info, callBack){
        this.socket.emit('response submission', info);
        this.socket.on('submission success', data=> callBack(data));
    }

    subscribeToPhaseStart(callback){
        this.socket.on('start phase', data=>callback(data));
    }

    subscribeToPhaseOver = (callback) => {
        this.socket.on('phase over', data => {
            callback();
        });
    };

    sendGameOver = () => {
        this.socket.emit('phase over', "finshed");
    };
}
