import React from "react";

export default class extends React.Component {
    answer = "";

    submitAnswer(){
        this.props.submitFunc(this.answer);
    }

    render() {
        const { main, sub } = this.props.phaseInfo;
        const { error } = this.props;
        return (
            <div>
                <h1>Save one thing from the {main}! ({sub})</h1>
                <input onChange={(e) => this.answer = e.target.value} />
                <button onClick={() => this.submitAnswer()}>Save it!</button>
                { error ? <p>{error}</p> : undefined }
            </div>
        );
    }
}
