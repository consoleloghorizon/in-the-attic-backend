import openSocket from 'socket.io-client';
import { get } from 'https';
const socket = openSocket('http://localhost:3000');

export const subscribeToPhaseChange = (callback) => {
    socket.on('phase over', data => callback(data));
};

export const sendPhaseOver = (gameCode) => {
    socket.emit('phase over', { gameCode } );
};

// export const joinGame = (username, gamecode) => {
//     fetch(`http://localhost:3000/login/${username}/${gamecode}`, {method: "get"}).then(response => {
//         console.log('response', response);
//         socket.emit('join game', { gameCode: gamecode, username: username });
//     });
// };