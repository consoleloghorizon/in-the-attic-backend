import {GameRoom} from "../data/gameRoom";
import { generateRoomCode } from "../util/roomCodeGenerator";

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
        return this.gameDictionary.hasOwnProperty(roomCode);
    }

    usernameAvailable(roomCode, username) {
        return this.gameDictionary[roomCode].usernameAvailable(username);
    }

    spaceAvailable(roomCode) {
        return this.gameDictionary[roomCode].spaceAvailable();
    }

    initPlayerInRoom(roomCode, username, socketId) {
        return this.gameDictionary[roomCode].initPlayer(username, socketId);
    }   

    getRoom(roomCode) {
        return this.gameDictionary[roomCode];
    }
}