import React from "react";

export class Login extends React.Component {
    logInfo = {
        userName: "",
        roomCode: "",
    }

    enterRoom(info) {
        console.log(info);
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
            </div>
        );
    }
}
