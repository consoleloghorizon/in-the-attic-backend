import React from "react";
import "./styles.css";
import axios from "axios";

export class Login extends React.Component {
    state = {
        awaitingServer: false,
        error: null,
    }
    logInfo = {
        userName: "",
        roomCode: "",
    }

    checkUser(userName, roomCode){
        return fetch(`http://3.92.201.176:3000/login/${userName}/${roomCode}`, {method: "get"})
    }

    async enterRoom (info) {
        // Log in must be performed with server, if successful
        // call this.props.login(<connectionInfo>);
        this.setState({awaitingServer: true})
        this.checkUser(info.userName, info.roomCode)
            .then(answer => {
                console.log(answer);
                if(answer.status >= 200 && answer.status < 300) {
                    this.props.login(info);
                }
                else {
                    this.setState({
                        error: answer.response.data.status,
                        awaitingServer: false,
                    })
                }
            })
            .catch(error => {
                console.log(error.response);
                this.setState({
                    error: error.response.data.status,
                    awaitingServer: false,
                })
            });
    }

    render(){
        return (
            <div className="join">
                <div>
                    <p className="welcome"><b><h1>Welcome to In The Attic!</h1></b></p>
                    <p className="welcome"><h2>Join a Game!</h2></p>
                    <div className="input-container">
                        <input className="username" placeholder="User" onChange={(e) => this.logInfo.userName = e.target.value} type="text" name="userName" id="userName" />
                    </div>
                    <div className="input-container">
                        <input className="roomId" onChange={(e) => this.logInfo.roomCode = e.target.value} placeholder="Room ID" type="text" name="roomId" id="roomId" />
                    </div>
                </div>
                <div className="enter-game">
                    <button className="submit-btn" onClick ={(event) => {
                        event.preventDefault();
                        this.enterRoom(this.logInfo);
                    }}>
                        ENTER!
                    </button>
                </div>
                {this.state.error ? <p>{this.state.error}</p> : undefined}
            </div>
        );
    }
}
