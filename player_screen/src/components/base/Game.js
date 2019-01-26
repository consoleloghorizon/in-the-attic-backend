import React from "react";
import GameComponents from "../ingame";
import { promises } from "fs";

const ChoiceState = {
    type: "ChoicePhase",
    prompt: {
        main: "Bathroom",
        sub: "Shower",
    },
    choices: {
        list: ["plunger", "toilet", "shower head", "shower curtain", "toaster", "rubber ducky"],
        votes: 1,
    },
}

const VotePhaseState = {
    ...ChoiceState,
    type: "VotePhase",
    choices: {
        list: ["plunger", "toilet", "shower head", "shower curtain", "rubber ducky"],
        votes: 2,
    }
}

/**
 * Father Component of all of the game states. Connect socket to game and change this.state with information received from the server.
 * @property Socket Info to be called on constructor, connect this object with server game 
 */
export class Game extends React.Component {
    constructor(props){
        super(props);

        // Connect to socket using props.connectionInfo
        // Or on component did mount?

        this.state = {
            game: 0,
        }
    }
    socketInput(input){
        console.log(input);
    }
    FakeSocket(input){
        return new Promise((res, rej) => {
            setTimeout(() => {
                console.log(input);
                res({message: "successfull"})
            }, 1000);
        });
    }

    submitToSocket(input){
        this.FakeSocket(input).then(answer => {
            this.setState({game: 1});
        })
    }

    // submitAnswer(input){
    //     FakeSocket(input)
    //         .then(res => )
    // }

    getGameComponent(){
        switch(this.state.game){
            case 0:
                return <GameComponents.Answer submitFunc={(str) => this.submitToSocket(str)}/>;
            case 1:
                return <GameComponents.Selection submitFunc={(str) => this.submitToSocket(str)} type={VotePhaseState.type} choices={VotePhaseState.choices.list}/>;
            default:
                return <GameComponents.MainLobby />;
        }
    }

    render() {
        return (
            <div>
                {this.getGameComponent()}
            </div>
        );
    }
}