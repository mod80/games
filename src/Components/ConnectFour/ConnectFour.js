import React, { Component } from 'react';
import BoardGame from '../BoardGame/BoardGame';

class ConnectFour extends Component {

  defaultPlayerStyles = {
    height: 80,
    width: 80,
    borderRadius: '50%',
    border: '4px double black'
  }

  connectfour = {
    name: 'ConnectFour',
    boardDimentions: {
      x: 6,
      y: 7
    },
    win: 4,
    hasGravity: true,
    players: [
      {
        value: '1',
        display: <div style={{...this.defaultPlayerStyles, backgroundColor: 'darkred'}} />
      },
      {
        value: '2',
        display: <div style={{...this.defaultPlayerStyles, backgroundColor: 'yellow'}} />
      }
    ],
    hasDrops: true,
  }

  render() {
    return (
      <BoardGame {...this.connectfour} />
    );
  }
}

export default ConnectFour;
