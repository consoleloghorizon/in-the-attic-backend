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
        let phaseTitle;
        switch(this.props.type){
            case "choice": 
                phaseTitle = "What else do you want to save?";
                break;
            case "votes":
                phaseTitle = "What's your least favourite?";
                break;
            case "choice - garbage":
                phaseTitle = "Save it from the dump!";
                break;
            default:
                phaseTitle = "Something is wrong Timy!"
        }
        return (
            <div>
                <h1>{phaseTitle}</h1>
                {this.createOptions(this.props.choices)}
            </div>
        );
    }
}
