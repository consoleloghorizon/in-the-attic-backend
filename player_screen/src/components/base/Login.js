import React from "react";

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
        return fetch(`http://localhost:3000/login/${userName}/${roomCode}`, {method: "get"})
    }

    async enterRoom (info) {
        // Log in must be performed with server, if successful
        // call this.props.login(<connectionInfo>);
        this.setState({awaitingServer: true})
        this.checkUser(info.userName, info.roomCode)
            .then(answer => {
                if(answer.status >= 200 && answer.status < 300) {
                    console.log("I LOGGED IN");
                    this.props.login(info);
                }
                else {
                    this.setState({
                        error: JSON.stringify(answer.body),
                        awaitingServer: false,
                    })
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    error,
                    awaitingServer: false,
                })
            });
    }

    render(){
        return (
            <div>
                <p>Welcome to In The Attic!</p>
                <label htmlFor="userName">User Name:</label>
                <input onChange={(e) => this.logInfo.userName = e.target.value} type="text" name="userName" id="userName" />
                <label htmlFor="roomId">Room Code:</label>
                <input onChange={(e) => this.logInfo.roomCode = e.target.value} type="text" name="roomId" id="roomId" />
                <button onClick ={(event) => {
                    event.preventDefault();
                    this.enterRoom(this.logInfo);
                }}>
                    ENTER!
                </button>
                {this.state.error ? <p>{this.state.error}</p> : undefined}
            </div>
        );
    }
}
