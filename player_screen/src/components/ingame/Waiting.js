import React from "react";

export default class Wait extends React.Component {
    render () {
        console.log("In waiting");
        console.log(this.props);
        let content;
        if(!this.props.gameEnded){
            if(this.props.submissionAccepted){
                content = (
                    <h2>Submission accepted! Waiting on other players.</h2>
                );
            } else {
                content = (
                    <h2>If you are seeing this something has gone really wrong.</h2>
                );
            }
        } else {
            if(this.props.isVIP && this.props.end){
                content = (
                    <div className="waiting-vip-end">
                        <button className="vip-options" onClick={() => this.props.playAgain()}>Play again with the same players!</button>
                        <button className="vip-options" onClick={() => this.props.endServer()}>Disband the army of movers.</button>
                        <div className="spacer"/>
                    </div>
                );
            } else {
                content = (
                    <h2 className="waiting-prompt">Waiting for the VIP to start or end the game.</h2>
                );
            }
        }
        return (
            <div>
                {content} 
            </div>
        );
    }
}
