import { Player } from "./player";
import { RoundStorage } from "../storage/roundStorage";
import { BUSY_STATUS, SETUP_STATUS, ACCEPTING_STATUS } from "../util/constants"
import _ from "lodash";

export class GameRoom {
    constructor(roomCode, maxPlayers, hostSocketId) {
        this.roomCode = roomCode;
        this.playerList = {};
        this.maxPlayers = maxPlayers;
        this.roomStatus = SETUP_STATUS;
        this.rounds = new RoundStorage();
        this.usedPrompts = [];
        this.phaseInfo = {};
        this.currentAnswers = {};
        this.losingAnswers = {};
        this.hostSocketId = hostSocketId;
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

    getLosingAnswers() {
        return this.losingAnswers;
    }

    getHost() {
        return this.hostSocketId;
    }

    getCurrentAnswers() {
        return this.currentAnswers;
    }

    addUsedPrompt(prompt) {
        this.usedPrompts.push(prompt);
    }

    addAnswerToList(playerSocketId, answer) {
        if (this.currentAnswers.hasOwnProperty(answer)) {
            const submittedBy = this.currentAnswers[answer].submittedBy;
            this.currentAnswers[answer].submittedBy = _.concat(submittedBy, playerSocketId);
        }
        else {
            const submittedBy = [];
            this.currentAnswers[answer] = {
                text: answer,
                submittedBy: _.concat(submittedBy, playerSocketId),
                chosenBy: [],
                votes: 0
            };
        }
    }

    chooseAnswerFromList(playerSocketId, answer) {
        const chosenBy = this.currentAnswers[answer].chosenBy;
        this.currentAnswers[answer].chosenBy = _.concat(chosenBy, playerSocketId);
    }

    voteForAnswer(answer) {
        this.currentAnswers[answer].votes++;
    }

    getSortedAnswerList() {
        const answers = Object.keys(this.currentAnswers).map(answer => this.currentAnswers[answer]);
        answers.sort((a, b) => a.votes - b.votes);
        return answers;
    }

    awardPointsToPlayer(playerSocketId, points) {
        this.playerList[playerSocketId].addPoints(points);
    }

    addLosingAnswers(losingAnswers) {
        let i = 0;
        for(i = 0; i < losingAnswers.length; i++) {
            this.losingAnswers[losingAnswers[i].text] = {
                text: losingAnswers[i]
            };
        }
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

    /*
        HEY CODE FRIENDS
        Below this point are the endpoint methods that you should use!
        I know there are some methods above this point that seem like the things you might want.
        But I assure you, that is false!
        That is only because the hour is late, my architecture is sloppy, and my life choices regrettable.
        Oh, and the getters at the top of the file are fine to use. 
    */

    initPlayer(username, socketId) {
        const newPlayer = new Player(username, socketId, Object.keys(this.playerList).length === 0);
        this.playerList[socketId] = newPlayer;
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

    acceptAnswer(playerSocketId, answer) {
        this.rounds.acceptAnswer(this, playerSocketId, answer);
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

    getPhaseInfo(playerSocketId) {
        if (_.isEmpty(this.phaseInfo)) {
            this.phaseInfo = this.rounds.getPhaseInfo(this, playerSocketId);
        }
        return this.rounds.getPhaseInfo(this);
    }

    resolvePhase() {
        this.rounds.resolvePhase(this);
    }
}