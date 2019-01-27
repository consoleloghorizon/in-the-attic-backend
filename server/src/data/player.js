export class Player {
    constructor(username, socketId, isVIP) {
        this.username = username;
        this.isVIP = isVIP;
        this.score = 0;
        this.socketId = socketId;
    }

    getUsername() {
        return this.username;
    }

    getAnswer() {
        return this.answer;
    }

    getScore() {
        return this.score;
    }

    isVIP() {
        return this.isVIP;
    }

    addPoints(points) {
        this.score += points; 
    }

    getSocketId() {
        return this.socketId;
    }
}