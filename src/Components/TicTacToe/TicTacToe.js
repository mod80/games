import React, { Component } from 'react';
import BoardGame from '../BoardGame/BoardGame';

class TicTacToe extends Component {

  tictactoe = {
    name: 'Tic-Tac-Toe',
    boardDimentions: {
      x: 3,
      y: 3
    },
    win: 3,
    hasGravity: false,
    players: [
      {value: '1', display: <div style={{height: 80,width: 80, fontSize: '5em', color: 'darkred',  lineHeight: '80px'}}>X</div> },
      {value: '2', display: <div style={{height: 80,width: 80, fontSize: '5em', color: 'darkblue', lineHeight: '80px'}}>O</div> }
    ],

  }

  render() {
    return (
      <BoardGame {...this.tictactoe} />
    );
  }
}

export default TicTacToe;
