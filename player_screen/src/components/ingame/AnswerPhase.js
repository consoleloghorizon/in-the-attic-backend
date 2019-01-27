import React from "react";

export default class extends React.Component {
    answer = "";

    submitAnswer(){
        this.props.submitFunc(this.answer);
    }

    render() {
        const { prompt, subpromt } = this.props;
        return (
            <div className="answer-phase">
                <h1>Save one thing from the {prompt}! ({subpromt})</h1>
                <div className="answer-input-container">
                    <input className="answer-input" onChange={(e) => this.answer = e.target.value} />
                </div>
                <button className="submit-btn" onClick={() => this.submitAnswer()}>Save it!</button>
                <div className="spacer"/>
            </div>
        );
    }
}
