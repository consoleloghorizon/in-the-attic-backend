import React from "react";

export default class Wait extends React.Component {
    render () {
        if (this.props.isVIP) {
            if (this.props.end) {
                return (
                <div className="waiting-vip-end">
                    <button className="vip-options" onClick={() => this.props.playAgain()}>Play again with the same players!</button>
                    <button className="vip-options" onClick={() => this.props.endServer()}>Disband army of movers</button>
                    <div className="spacer"/>
                </div>
                );
            }
        }
        return (
            <div>
                <p className="waiting-next"><h2>Waiting on the next round!</h2></p>      
                <div className="spacer"/>
            </div>     
        );
    }
}
