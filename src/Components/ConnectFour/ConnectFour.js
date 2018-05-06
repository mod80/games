import React, { Component } from 'react';
import BoardGame from '../BoardGame/BoardGame';

class ConnectFour extends Component {

  connectfour = {
    name: 'ConnectFour',
    boardDimentions: {
      x: 6,
      y: 7
    },
    win: 4,
    hasGravity: true,
    players: [
      {value: '1', display: <div style={{height: 85,width: 85, borderRadius: '50%', backgroundColor: 'darkred', border: '8px double black'}} /> },
      {value: '2', display: <div style={{height: 85,width: 85, borderRadius: '50%', backgroundColor: '#f7e746', border: 'double black 8px'}} /> }
    ],
  }

  render() {
    return (
      <BoardGame {...this.connectfour} />
    );
  }
}

export default ConnectFour;
