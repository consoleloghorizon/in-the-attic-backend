import React from "react";
import GameComponents from "../ingame";

import { subscribeToPhaseChange, sendPhaseOver } from '../../sockets/socketManager';


/**
 * Father Component of all of the game states. Connect socket to game and change this.state with information received from the server.
 * @property Socket Info to be called on constructor, connect this object with server game 
 */
export class Game extends React.Component {
    constructor(props){
        super(props);

        // Connect to socket using props.connectionInfo
        // Or on component did mount?

        subscribeToPhaseChange((data) => { 
            
            console.log("testing this", data);
            this.setState({
                responseTest: data,
                game: 0
            });
    });

        this.state = {
            game: 0,
        }
    }

    socketInput(input){
        console.log(input);
    }

    submitToSocket(input){
        setTimeout(() => {
            this.socketInput(input);
            this.setState({ game: 1 });
        }, 1000);
    }

    getGameComponent(){
        switch(this.state.game){
            case 0:
                return <GameComponents.Answer submitFunc={(str) => this.submitToSocket(str)}/>;
            case 1:
                return <GameComponents.Selection />;
            default:
                return <GameComponents.MainLobby />;
        }
    }

    sendPhaseOver(){
        sendPhaseOver("GY6BNr6oC")
    }

    render() {
        return (
            <div>
                {this.getGameComponent()}
                <button onClick={this.sendPhaseOver.bind(this)}>
                    Test Sockets
                </button>
            </div>
        );
    }
}