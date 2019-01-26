import {GameRoom} from "../data/gameRoom";
import shortid from 'shortid';

export class GameStorage {
    constructor() {
        this.gameDictionary = {};
    }

    initializeGameRoom() {
        const newId = shortid.generate();
        const newRoom = new GameRoom(newId);
        this.gameDictionary[newId] = newRoom;

        return newRoom;
    }
}