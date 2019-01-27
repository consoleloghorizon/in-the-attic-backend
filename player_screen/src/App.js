import React, { Component } from 'react';
import { Login } from "./components/base/Login";
import { Game } from './components/base/Game';

class App extends Component {
  state = { connectionInfo: null };
  login(connectionInfo){
    this.setState({ connectionInfo });
  }
  render() {
    return (
      <div className="App">
        {this.state.connectionInfo ? 
          <Game connectionInfo={this.state.connectionInfo} />
          :
          <Login login={(connectionInfo) => this.login(connectionInfo)} />
        }
      </div>
    );
  }
}

export default App;
