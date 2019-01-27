export class Player {
    constructor(username, isVIP) {
        this.username = username;
        this.isVIP = isVIP;
        this.score = 0;
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
}