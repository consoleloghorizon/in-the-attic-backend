// import express from 'express';
// import Server from 'socket.io';

const express = require('express')
// const io = new Server();
const app = express();
const port = 3000;

const HOST_APPLICATION_PATH = '/player_screen/public'
app.get('/', function(req, res){
    res.sendFile(__dirname + HOST_APPLICATION_PATH + '/index.html');
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));