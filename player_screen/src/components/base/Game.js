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

    getGameComponent(){
        switch(this.state.game){
            case 0:
                return <GameComponents.Answer />;
            case 1:
                return <GameComponents.Selection />;
            default:
                return <GameComponents.MainLobby />;
        }
    }

    render() {
        setTimeout(() => {
            this.setState({ game: ((this.state.game + 1) % 3) })
        }, 500);
        return (
            <div>
                {this.getGameComponent()}
            </div>
        );
    }
}