import {GameRoom} from "../data/gameRoom";
import shortid from 'shortid';

export class GameStorage {
    constructor(maxPlayers) {
        this.gameDictionary = {};
        this.maxPlayers = maxPlayers;
    }

    initializeGameRoom() {
        const newId = shortid.generate();
        const newRoom = new GameRoom(newId);
        this.gameDictionary[newId] = newRoom;

        return newRoom;
    }

    gameRoomExists(roomId) {
        return this.gameDictionary.hasOwnProperty(roomId);
    }

    usernameAvailable(roomId, username) {
        return this.gameDictionary[roomId].usernameAvailable(username);
    }

    spaceAvailable(roomId) {
        return this.gameDictionary[roomId].spaceAvailable();
    }

    initPlayerInRoom(roomId, username) {
        return this.gameDictionary[roomId].initPlayer(username);
    }   
}