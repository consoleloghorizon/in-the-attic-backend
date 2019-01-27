import {GameRoom} from "../data/gameRoom";
import { generateRoomCode } from "../util/roomCodeGenerator";
<<<<<<< HEAD
import * as _ from "lodash";
=======
import _ from "lodash";
>>>>>>> b0730d8b92a4b0f4cfca28cf9a5c53b14d68f92e

export class GameStorage {
    constructor(maxPlayers) {
        this.gameDictionary = {};
        this.maxPlayers = maxPlayers;
    }

    initializeGameRoom() {
        const newId = generateRoomCode(4);
        const newRoom = new GameRoom(newId, this.maxPlayers);
        this.gameDictionary[newId] = newRoom;

        return newRoom;
    }

    gameRoomExists(roomCode) {
        const parsedCode = _.toUpper(roomCode);
        return this.gameDictionary.hasOwnProperty(parsedCode);
    }

    usernameAvailable(roomCode, username) {
        const parsedCode = _.toUpper(roomCode);
        return this.gameDictionary[parsedCode].usernameAvailable(username);
    }

    spaceAvailable(roomCode) {
        const parsedCode = _.toUpper(roomCode);
        return this.gameDictionary[parsedCode].spaceAvailable();
    }

    initPlayerInRoom(roomCode, username, socketId) {
        const parsedCode = _.toUpper(roomCode);
        return this.gameDictionary[parsedCode].initPlayer(username, socketId);
    }   

    getRoom(roomCode) {
        const parsedCode = _.toUpper(roomCode);
        return this.gameDictionary[parsedCode];
    }
}