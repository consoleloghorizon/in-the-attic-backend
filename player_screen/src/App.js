import React, { Component } from 'react';
import { Login } from "./components/base/Login";
import { Game } from './components/base/Game';
import './styles.css'

class App extends Component {
  state = { connectionInfo: null };
  login(connectionInfo){
    this.setState({ connectionInfo });
  }
  logout(){this.setState({connectionInfo: null})};
  render() {
    return (
      <div className="App">
        {this.state.connectionInfo ? 
          <Game connectionInfo={this.state.connectionInfo} logOut={() => this.logout()} />
          :
          <Login login={(connectionInfo) => this.login(connectionInfo)} />
        }
      </div>
    );
  }
}

export default App;
