import React from "react";

export default class Wait extends React.Component {
    render () {
        if (this.props.isVIP) {
            if (this.props.end) {
                return (<div>
                    <button onClick={() => this.props.playAgain()}>Play again with the same players!</button>
                    <button onClick={() => this.props.endServer()}>Disband army of movers</button>
                </div>);
            }
        }
        return (
            <p>Waiting on the next round!</p>           
        );
    }
}
