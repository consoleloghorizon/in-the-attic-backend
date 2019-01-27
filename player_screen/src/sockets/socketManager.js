import openSocket from 'socket.io-client';
export default class Socket{
    constructor(username, gamecode){
        var socket = openSocket('http://localhost:3000');
        socket.emit('join game', { gameCode: gamecode, username: username });
    }    

    subscribeToPhaseChange = (callback) => {
        this.socket.on('phase over', data => {
            console.log('phase game data', data);
            callback(data);
        });
    };

    sendPhaseOver = () => {
        this.socket.emit('phase over', "finshed");
    };
}
