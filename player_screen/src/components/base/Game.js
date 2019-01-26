import React from "react";
import GameComponents from "../ingame";
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

    render() {
        return (
            <div>
                {this.getGameComponent()}
            </div>
        );
    }
}