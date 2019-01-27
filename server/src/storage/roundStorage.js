import { AnswerPhase, ChoicePhase, VotePhase, ScorePhase, ResultsPhase } from "../data/phases";

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
                //Note: We need to make a GarbageChoice and GarbageVote phase, since they behave differently
                phases: [new ChoicePhase(), new VotePhase(), new ResultsPhase()]
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

    acceptAnswer(gameRoom) {
        return this.roundList[this.currentRound].phases[this.currentPhase]
    }

    getPhaseInfo(gameRoom) {
        return this.roundList[this.currentRound].phases[this.currentPhase].getPhaseInfo(gameRoom);
    }

    resolvePhase(gameRoom) {
        return this.roundList[this.currentRound].phases[this.currentPhase].resolvePhase(gameRoom);
    }
}