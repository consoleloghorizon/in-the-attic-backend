import React from "react";

export default class extends React.Component {
    constructor(props){
        super(props);
        this.state = { answered: [], disabled: false, tempError: null }; 
    }

    submitAnswers(){
        this.props.submitFunc(this.state.answered);
    }

    selectAnswer(option){
        let temp = this.state.answered;
        var index = temp.indexOf(option);
        if (index !== -1) {
            temp.splice(index, 1);
            this.setState({answered: temp, tempError: null});
        }else if (temp.length < this.props.voteNum){
            this.setState({answered: [...temp, option], tempError: null})
        } else {
            this.setState({tempError: "Please deselect something"});
        }
    }

    createOptions(list){
        return (
            <div>
                {list.map((option) => {
                    return <p key={option}>
                        <button 
                            disabled={this.state.disabled}
                            onClick={() => this.selectAnswer(option)}
                            className={!this.state.answered.includes(option) ?
                                "choice-btn"
                                :
                                "choice-btn selected"
                            }
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
                phaseTitle = "Something is wrong Timmy!"
        }
        return (
            <div>
                <h1 className="phase-title">{phaseTitle}</h1>
                {this.createOptions(this.props.choices)}
                <button onClick={() => this.submitAnswers()}>Submit answers!</button>
                {this.state.tempError ? <p>{this.state.tempError}</p> : undefined}
                {this.props.error ? <p>{this.props.error}</p> : undefined}
                <div className="spacer"/>
            </div>
        );
    }
}
