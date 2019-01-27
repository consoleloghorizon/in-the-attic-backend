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
            this.setState({ isVIP: data.isVIP });
        });
        this.socket.gameIsStarting(data => {
            this.setState({ gameIsActive: data.status });
        });
        this.socket.subscribeToPhaseStart(data=> {
            console.log(data);
            this.setState({ phaseInfo: data.phaseInfo})
        });
        this.state = {
            isVIP: false,
            gameIsActive: false,
            gameEnded: false,
            phaseInfo: null,
            error: null,
        }
    }

    sendInfo(ans){
        this.socket.sendInfo(
            {gameCode: this.props.connectionInfo.roomCode, answer: ans},
            data => {
                if(data.isTrue) this.setState({phaseInfo: null, error: null});
                else this.setState({error: data.error})
            }
        )
    }

    getGameComponent(){
        if (!this.state.gameIsActive) {
            return (
                <GameComponents.MainLobby
                    isVIP={this.state.isVIP}
                    startGame={() => this.socket.startGame(this.props.connectionInfo.roomCode)}
                />
            );
        }
        if (!this.state.phaseInfo) {
            return (
                <GameComponents.Wait
                    isVIP={this.state.isVIP}
                    gameEnded={this.state.gameEnded}
                    playAgain={() => console.log("VIP says play again,", this.props.connectionInfo.roomCode)}
                    endServer={() => console.log("VIP says disband", this.props.connectionInfo.roomCode)}
                />
            );
        }
        if (this.state.phaseInfo.type === "answer") {
            return (<GameComponents.Answer
                error={this.state.error}
                phaseInfo={this.state.phaseInfo}
                submitFunc= {(str) => this.sendInfo(str)}
            />);
        }
        // votes: # of votes available on phase
        return (<GameComponents.Selection
            submitFunc= {(str) => this.sendInfo(str)}
            error={this.state.error}
            type={this.state.phaseInfo.type}
            choices={this.state.phaseInfo.list}
        />);
    }

    render() {
        return (
            <div>
                {this.getGameComponent()}
            </div>
        );
    }
}