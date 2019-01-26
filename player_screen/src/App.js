import React, { Component } from 'react';
import { Login } from "./components/base/Login";
import { Game } from './components/base/Game';

import { subscribeToPhaseChange, sendPhaseOver, joinGame } from '../../sockets/socketManager';

class App extends Component {
  login(connectionInfo){
    this.setState({ connectionInfo });
  }
  render() {
    return (
      <div className="App">
        {this.state ? 
          <Game connectionInfo={this.connectionInfo} socketActions={{
            subscribeToPhaseChange: subscribeToPhaseChange, 
            sendPhaseOver: sendPhaseOver
          }}/>
          :
          <Login login={(connectionInfo) => this.login(connectionInfo)} socketActions={{
            subscribeToPhaseChange: subscribeToPhaseChange, 
            sendPhaseOver: sendPhaseOver,
            joinGame: joinGame
          }}/>
        }
      </div>
    );
  }
}

export default App;
