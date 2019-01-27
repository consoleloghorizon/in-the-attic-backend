import { Player } from "./player";

export class GameRoom {
    constructor(roomCode, maxPlayers) {
        this.roomCode = roomCode;
        this.playerList = {};
        this.maxPlayers = maxPlayers;
    }

    getRoomCode() {
        return this.roomCode;
    }

    usernameAvailable(username) {
        let player;
        for (player in this.playerList) {
            if (this.playerList[player].getUsername() === username) {
                return false;
            }
        }

        return true;
    }

    spaceAvailable() {
        return Object.keys(this.playerList).length < this.maxPlayers;
    }

    initPlayer(username) {
        const newPlayer = new Player(username, Object.keys(this.playerList).length === 0);
        this.playerList[username] = newPlayer;
        return newPlayer;
    }
}