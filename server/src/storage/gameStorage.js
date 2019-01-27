import {GameRoom} from "../data/gameRoom";
import shortid from 'shortid';

export class GameStorage {
    constructor(maxPlayers) {
        this.gameDictionary = {};
        this.maxPlayers = maxPlayers;
    }

    initializeGameRoom() {
        const newId = shortid.generate();
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

    initPlayerInRoom(roomCode, username) {
        return this.gameDictionary[roomCode].initPlayer(username);
    }   

    getRoom(roomCode) {
        return this.gameDictionary[roomCode];
    }
}