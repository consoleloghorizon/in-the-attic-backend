import _ from "lodash";

export class AnswerPhase {
    constructor() {

    }

    getPhaseInfo(gameRoom) {
        const usedPrompts = gameRoom.getUsedPrompts();

        const prompts = [{
            text: "Bathroom",
            sub: ["for the shower", "for the bathtub"]
        },
        {
            text: "Dining Room",
            sub: ["where we shall scare off the neighbors", "to protect your food"]
        },
        {
            text: "Attic",
            sub: ["where no one shall ever know", "to welcome our bat friends"]
        }];
        const availablePrompts = _.difference(prompts, usedPrompts);

        const randomPrompt = availablePrompts[_.random(0, availablePrompts.length - 1, false)];
        const randomSubPrompt = randomPrompt.sub[_.random(0, randomPrompt.sub.length - 1, false)];

        gameRoom.addUsedPrompt(randomPrompt);

        return {
            type: "answer",
            main: randomPrompt.text,
            sub: randomSubPrompt
        };
    }

    acceptAnswer(gameRoom, playerSocketId, answer) {
        gameRoom.addAnswerToList(playerSocketId, answer);
    }

    resolvePhase(gameRoom) {
        return "OKAY";
    }
}

export class ChoicePhase {
    constructor() {

    }

    getPhaseInfo(gameRoom, playerSocketId) {
        const answers = gameRoom.getCurrentAnswers();
        const answerKeys = Object.keys(gameRoom.getCurrentAnswers());

        const filteredAnswers = answerKeys.filter(answer => !answers[answer].submittedBy.includes(playerSocketId));

        return {
            type: "choice",
            list: filteredAnswers,
            votes: 1
        };
    }

    acceptAnswer(gameRoom, playerSocketId, answer) {
        gameRoom.chooseAnswerFromList(playerSocketId, answer);
    }

    resolvePhase(gameRoom) {
        return "OKAY";
    }
}

export class VotePhase {
    constructor() {
    }

    getPhaseInfo(gameRoom) {
        const choices = Object.keys(gameRoom.getCurrentAnswers());

        return {
            type: "choice",
            list: choices,
            votes: 3
        };
    }

    acceptAnswer(gameRoom, playerSocketId, answer) {
        gameRoom.voteForAnswer(answer);
    }

    resolvePhase(gameRoom) {
        const itemsToKeep = Math.ceil(Object.keys(gameRoom.getPlayerList()).length * .75)
        const answerList = gameRoom.getSortedAnswerList();
        const winningAnswers = _.slice(answerList, 0, itemsToKeep);
        const losingAnswers = _.slice(answerList, itemsToKeep);
        gameRoom.addLosingAnswers(losingAnswers);

        let answer, playerSocketId;
        for (answer in winningAnswers) {
            const chosenByNumber = winningAnswers[answer].chosenBy.length;
            for (playerSocketId in winningAnswers[answer].submittedBy) {
                gameRoom.awardPointsToPlayer(playerSocketId, 1000 + chosenByNumber * 250);
            }

            for (playerSocketId in winningAnswers[answer].chosenBy) {
                gameRoom.awardPointsToPlayer(playerSocketId, 500);
            }
        }
    }
}

export class ScorePhase {
    constructor() {

    }

    getPhaseInfo(gameRoom) {
        const players = Object.keys(gameRoom.getPlayerList());

        const scores = players.map(player => {
            const playerData = gameRoom.getPlayerList()[player];
            return {
                username: playerData.getUsername(),
                score: playerData.getScore()
            };
        });

        return {
            type: "score",
            scoreList: scores,
            final: false
        };
    }

    resolvePhase(gameRoom) {
        return "OKAY";
    }
}

export class ResultsPhase {
    constructor() {

    }

    getPhaseInfo(gameRoom) {
        const players = Object.keys(gameRoom.getPlayerList());

        const scores = players.map(player => {
            const playerData = gameRoom.getPlayerList()[player];
            return {
                username: playerData.getUsername(),
                score: playerData.getScore()
            };
        });

        return {
            type: "score",
            scoreList: scores,
            final: true
        };
    }

    resolvePhase(gameRoom) {
        return "OKAY";
    }
}

export class GarbageChoicePhase {
    constructor() {

    }

    getPhaseInfo(gameRoom) {
        const garbageAnswers = gameRoom.getLosingAnswers();
        const choices = garbageAnswers.map(answer => answer.text);

        return {
            type: "choice - garbage",
            list: choices,
            votes: 1
        };
    }

    acceptAnswer(gameRoom, playerSocketId, answer) {
        gameRoom.addAnswerToList(playerSocketId, answer);
    }

    resolvePhase(gameRoom) {
        return "OKAY";
    }
}