import { AnswerPhase, ChoicePhase, VotePhase, ScorePhase, ResultsPhase, GarbageChoicePhase } from "../data/phases";

export class RoundStorage {
    constructor() {
        this.roundList = [
            {
                phases: [new AnswerPhase(), new ChoicePhase(), new VotePhase(), new ScorePhase()]
            },
            {
                phases: [new AnswerPhase(), new ChoicePhase(), new VotePhase(), new ScorePhase()]
            },
            {
                phases: [new GarbageChoicePhase(), new VotePhase(), new ResultsPhase()]
            }
        ];
        this.currentRound = 0;
        this.currentPhase = -1; 
    }

    advancePhase() {
        this.currentPhase++;
        if (this.roundList[this.currentRound].phases.length <= this.currentPhase) {
            this.currentPhase = 0;
            this.currentRound++;
        }
    }

    acceptAnswer(gameRoom, playerSocketId, answer) {
        return this.roundList[this.currentRound].phases[this.currentPhase].acceptAnswer(gameRoom, playerSocketId, answer);
    }

    getPhaseInfo(gameRoom, playerSocketId) {
        return this.roundList[this.currentRound].phases[this.currentPhase].getPhaseInfo(gameRoom, playerSocketId);
    }

    resolvePhase(gameRoom) {
        return this.roundList[this.currentRound].phases[this.currentPhase].resolvePhase(gameRoom);
    }
}