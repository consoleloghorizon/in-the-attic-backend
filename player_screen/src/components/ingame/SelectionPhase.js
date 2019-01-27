import React from "react";

export default class extends React.Component {
    state = { answered: [] };

    submitAnswer(option){
        this.setState = { answered: this.state.answered.push(option) };
        this.props.submitFunc(option);
    }

    createOptions(list){
        return (
            <div>
                {list.map((option) => {
                    return <p key={option}>
                        <button 
                            disabled={this.state.answered.includes(option)}
                            onClick={() => this.submitAnswer(option)}
                        >
                        {option}
                        </button></p>
                })}
            </div>
        );
    }

    render() {
        const phaseTitle = this.props.type === "ChoicePhase" ?
            "What other thing do you want to save?" : 
            "What do you want to throw out?";
        return (
            <div>
                <h1>{phaseTitle}</h1>
                {this.createOptions(this.props.choices)}
            </div>
        );
    }
}
