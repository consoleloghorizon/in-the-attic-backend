import React from "react";

export default class extends React.Component {
    render() {
        return (
            <div className="main-lobby">
                <h3 className="welcome">Player {this.props.userName}</h3>
                {this.props.isVIP?
                <button className="start-btn" onClick={() => this.props.startGame()}>Start the game!</button>
                :
                <h2 className="waiting-prompt">Waiting for the VIP to start the game....</h2>
                }
            </div>
        );
    }
}
