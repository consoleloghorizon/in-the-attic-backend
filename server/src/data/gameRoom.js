import { Player } from "./player";
import { RoundStorage } from "../storage/roundStorage";
import { BUSY_STATUS, SETUP_STATUS, ACCEPTING_STATUS } from "../util/constants"
import _ from "lodash";

export class GameRoom {
    constructor(roomCode, maxPlayers) {
        this.roomCode = roomCode;
        this.playerList = {};
        this.maxPlayers = maxPlayers;
        this.roomStatus = SETUP_STATUS;
        this.rounds = new RoundStorage();
        this.usedPrompts = [];
        this.phaseInfo = {};
        this.currentAnswers = {};
        this.losingAnswers = {};
    }

    getRoomCode() {
        return this.roomCode;
    }

    getPlayerList() {
        return this.playerList;
    }

    getUsedPrompts() {
        return this.usedPrompts;
    }

    addUsedPrompts(prompt) {
        this.usedPrompts.push(prompt);
    }

    addAnswerToList(username, answer) {
        if (this.currentAnswers.hasOwnProperty(answer)) {
            const submittedBy = this.currentAnswers[answer].submittedBy;
            this.currentAnswers[answer].submittedBy = _.concat(submittedBy, username);
        }
        else {
            const submittedBy = [];
            this.currentAnswers[answer] = {
                text: answer,
                submittedBy: _.concat(submittedBy, username),
                chosenBy: [],
                votes: 0
            };
        }
    }

    chooseAnswerFromList(username, answer) {
        const chosenBy = this.currentAnswers[answer].chosenBy;
        this.currentAnswers[answer].chosenBy = _.concat(chosenBy, username);
    }

    voteForAnswer(answer) {
        this.currentAnswers[answer].votes++;
    }

    getSortedAnswerList() {
        const answers = Object.keys(this.currentAnswers).map(answer => this.currentAnswers[answer]);
        answers.sort((a, b) => a.votes - b.votes);
        return answers;
    }

    awardPointsToPlayer(username, points) {
        this.playerList[username].addPoints(points);
    }

    addLosingAnswers(losingAnswers) {
        let i = 0;
        for(i = 0; i < losingAnswers.length; i++) {
            this.losingAnswers[losingAnswers[i].text] = losingAnswers[i];
        }
    }

    usernameAvailable(username) {
        let player;
        for (player in this.playerList) {
            if (player.getUsername() === username) {
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

    startGame() {
        if (this.roomStatus === SETUP_STATUS) {
            this.roomStatus = BUSY_STATUS;
        }
    }

    startAcceptingAnswers() {
        if (this.roomStatus === BUSY_STATUS) {
            this.roomStatus = ACCEPTING_STATUS;
        }
    }

    acceptAnswer(username, answer) {
        this.rounds.acceptAnswer(this, username, answer);
    }

    stopAcceptingAnswers() {
        if (this.roomStatus === ACCEPTING_STATUS) {
            this.roomStatus = BUSY_STATUS;
        }
    }

    startPhase() {
        this.rounds.advancePhase();
        this.phaseInfo = {};
    }

    getPhaseInfo() {
        if (_.isEmpty(this.phaseInfo)) {
            this.phaseInfo = this.rounds.getPhaseInfo(this);
        }
        return this.rounds.getPhaseInfo(this);
    }

    resolvePhase() {
        this.rounds.resolvePhase(this);
    }
}