import React, { Component } from 'react';
import TicTacToe from './Components/TicTacToe/TicTacToe';
import ConnectFour from './Components/ConnectFour/ConnectFour';
import './app.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <TicTacToe />
        <ConnectFour />
      </div>
    );
  }
}

export default App;
