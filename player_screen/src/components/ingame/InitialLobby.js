import React from "react";

export default class extends React.Component {
    render() {
        return (
            <div>
                <p>Player {this.props.userName}</p>
                {this.props.isVIP?
                <button onClick={() => this.props.startGame()}>Start the game!</button>
                :
                <p>Waiting for the VIP to start the game.</p>
                }
            </div>
        );
    }
}
