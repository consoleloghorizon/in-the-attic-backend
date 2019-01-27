import {GameRoom} from "../data/gameRoom";
import { generateRoomCode } from "../util/roomCodeGenerator";
import _ from "lodash";

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