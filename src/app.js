import { APPLICATION_PORT, HOST_APPLICATION_PATH } from './util/constants';
import Server from 'socket.io';
import express from 'express';

const io = new Server();
const app = express();

app.get('/', function(req, res){
    res.sendFile(__dirname + HOST_APPLICATION_PATH + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.listen(APPLICATION_PORT, () => console.log(`Example app listening on port ${APPLICATION_PORT}!`));