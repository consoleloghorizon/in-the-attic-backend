import React, { Component } from 'react';
import { Login } from "./components/base/Login";
import { Game } from './components/base/Game';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
    }
  }
  render() {
    console.log(this.state);
    return (
      <div className="App">
        {this.state.loggedIn ? <Game /> : <Login />}
      </div>
    );
  }
}

export default App;
