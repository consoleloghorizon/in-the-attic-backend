import openSocket from 'socket.io-client';
export default class Socket{
    constructor(username, gamecode){
        this.socket = openSocket('http://localhost:3000');
    }

    joinGame(callback) {
        this.socket.on('player joined game', data => {
            console.log("Got messaged from player joined game");
            callback(data);
        });
    };

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
