import React from "react";

export default class extends React.Component {
    answer = "";

    submitAnswer(){
        this.props.submitFunc(this.answer);
    }

    render() {
        const { prompt, subpromt } = this.props;
        return (
            <div>
                <h1>Save one thing from the {prompt}! ({subpromt})</h1>
                <input onChange={(e) => this.answer = e.target.value} />
                <button onClick={() => this.submitAnswer()}>Save it!</button>
            </div>
        );
    }
}
