import React, { Component } from 'react';
import { Login } from "./components/base/Login";
import { Game } from './components/base/Game';
import io from 'socket.io-client';

class App extends Component {
  login(connectionInfo){
    this.setState({ connectionInfo });
  }
  render() {
    return (
      <div className="App">
        {this.state ? 
          <Game connectionInfo={this.connectionInfo}/>
          :
          <Login login={(connectionInfo) => this.login(connectionInfo)}/>
        }
      </div>
    );
  }
}

export default App;
