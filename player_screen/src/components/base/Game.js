import React from "react";
import GameComponents from "../ingame";
import Sock from "../../sockets/socketManager"

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

        this.socket = new Sock(props.connectionInfo.userName, props.connectionInfo.roomCode);
        this.socket.joinGame(data => {
            console.log("Callback listening to player joined, ", data);
        })
        this.state = {

        }
    }
    socketInput(input){
    }

    submitToSocket(input){
        this.FakeSocket(input);
        this.setState({game: 1});
    }

    getGameComponent(){
        switch(this.state.game){
            case 0:
                return <GameComponents.Answer 
                    submitFunc= {(str) => this.submitToSocket(str)}
                />;
            case 1:
                return <GameComponents.Selection
                    submitFunc={(str) => this.submitToSocket(str)}
                    type={VotePhaseState.type}
                    choices={VotePhaseState.choices.list}
                />;
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