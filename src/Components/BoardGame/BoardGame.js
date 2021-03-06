import React, { Component } from 'react';
import Cell from './Cell';
import './BoardGame.css';

class BoardGame extends Component {

  constructor(props){
    super(props);
    this.state = {
      gameName: props.name,
      boardDimentions: {
        x: props.boardDimentions.x,
        y: props.boardDimentions.y,
        cells: props.boardDimentions.x * props.boardDimentions.y
      },
      winMax: props.win,
      hasGravity: props.hasGravity || false,
      hasDrops: props.hasProps || false,
      boardValues: [],
      game: {
        winnerFound: false,
        winner: ''
      },
      players: props.players,
      currentPlayer: 0,
      moves: 0,
      winningCells: [],
      lastPosition: {
        x: 0,
        y: 0
      },
      drop: 0,
    };
    this.handleCellChange = this.handleCellChange.bind(this);
    this.setDimentions = this.setDimentions.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.findby = this.findby.bind(this);
  }

  emptyMatrix(x,y){
    let rows = [];
    for (var idx = 0; idx < x; idx++) {
      let cells = [];
      for (var idy = 0; idy < y; idy++) {
        cells.push(0);
      }
      rows.push(cells);
    }
    return rows;
  }

  setDimentions(x,y){
    let rows = this.emptyMatrix(x,y)
    this.setState({
      ...this.state,
      boardDimentions: {
        x: x,
        y: y,
        cells: (x*y)
      },
      boardValues: rows
    });
  }

  inBoundOrZero(arr,x,y){
    if(typeof(arr[x]) === typeof([]) ){
      if(typeof(arr[x][y]) !== 'undefined'){
        return arr[x][y];
      }
    }
    return 0;
  }

  // retuns array of found and array of scanned
  // {name: Passed in type, found: [], scanned [[x: 00, y: 00]] }

  findby(type, start, max, matrix){

    let offset = max - 1;
    let scanLength = ( max * 2) - 1;
    let found = [];
    let scanned = [];
    let findX = start.x;
    let findY = start.y;
    let itX = 1;
    let itY = 1;

    switch (type) {
      case 'COLUMN':
        findX = findX - offset;
        itY = 0;
        break;
      case 'ROW':
        findY = findY - offset;
        itX = 0;
        break;
      case 'DIAGLEFT':
        findX = findX - offset;
        findY = findY - offset;
        break;
      case 'DIAGRIGHT':
        findX = findX - offset;
        findY = findY + offset;
        itY = -1;
        break;
      default:
        console.warn('findby fall thought!')
        return this.findby('COLUMN', start, max, matrix);
    }

    for (let i = 0; i < scanLength; i++) {
      let grabX = findX + (itX * i);
      let grabY = findY + (itY * i);
      if(
        (grabY >= 0 && grabY <= this.state.boardDimentions.y-1) &&
        (grabX >= 0 && grabX <= this.state.boardDimentions.x-1)
      ) {
        found.push(this.inBoundOrZero(matrix,[grabX],[grabY]));
        scanned.push([grabX,grabY]);
      }

    }

    return { name: type, found: found, scanned: scanned };

  }

  findWinner(){
    let boardValues = this.state.boardValues;
    let scanLength = (this.state.winMax * 2) - 1;
    let x = parseInt(this.state.lastPosition.x, 10);
    let y = parseInt(this.state.lastPosition.y, 10);

    let players = this.state.players;
    let currentPlayer =  this.state.currentPlayer;

    // find columns
    let columnCheck = this.findby('COLUMN', {x:x,y:y},scanLength,boardValues);
    // find rows
    let rowCheck = this.findby('ROW', {x:x,y:y},scanLength,boardValues);
    // find diagonal left
    let diagLeftCheck = this.findby('DIAGLEFT', {x:x,y:y},scanLength,boardValues);
    // find diagonal right
    let diagRightCheck = this.findby('DIAGRIGHT', {x:x,y:y},scanLength,boardValues);

    let testFor = new Array(this.state.winMax)
                      .fill(players[currentPlayer].value)
                      .join(',');

    let checks = [ columnCheck, rowCheck, diagLeftCheck, diagRightCheck ];

    const findInTestArray = (array) => {
      let findIn = array.join(',').indexOf(testFor);
      return (findIn > -1) ? true : false;
    }

    let winners = checks.filter( group => ( findInTestArray(group.found) ) );

    let winningValues = winners.map( win => {
      let winOut = {
        type: win.name,
        scanned: [],
        found: []
      };

      let winningIndexs = [];
      let winToken = players[currentPlayer].value;
      let centerIndex = win.scanned.findIndex( cell =>
                                                cell[0] === x &&
                                                cell[1] === y);

      winningIndexs.push(centerIndex);
      // loop to beginning
      let i = centerIndex;
      let isToken = true;
      while (i > 0 && isToken) {
        i--;
        if(win.found[i] === winToken){
          winningIndexs.push(i);
        } else {
          isToken = false;
        }
      }
      // loop to end or last
      i = centerIndex;
      isToken = true;
      while (i < (win.found.length -1) && isToken) {
        i++;
        if(win.found[i] === winToken){
          winningIndexs.push(i);
        } else {
          isToken = false;
        }
      }

      for (let i = 0; i < winningIndexs.length; i++) {
        winOut.scanned.push(win.scanned[winningIndexs[i]]);
        winOut.found.push(win.found[winningIndexs[i]]);
      }

      return winOut;

    });
    return winningValues;
  }

  resetBoard() {

    let board = this.emptyMatrix(
      this.state.boardDimentions.x,
      this.state.boardDimentions.y);

    this.setState({
      ...this.state,
      currentPlayer: 0,
      game: {
        started: false,
        winnerFound: false,
        winner: '',
      },
      moves: 0,
      boardValues: board,
      winningCells: [],
    });
  }

  switchPlayer(){
    let player = this.state.currentPlayer;
    let players = this.state.players;

    if(player === players.length - 1){
      player = 0;
    } else {
      player = player+1;
    }
    this.setState({
      ...this.state,
      currentPlayer: player
    });
  }

  handleCellChange(x,y){

    if(this.state.game.winnerFound){
      return false;
    }

    let board = Object.assign([], this.state.boardValues);
    let players = this.state.players;
    let currentPlayer =  this.state.currentPlayer;
    let position = {x:x,y:y};
    let drop = 0;

    if(this.state.hasGravity){
      let columnData = this.findby(
          'COLUMN',
          {x:position.x,y:position.y},
          this.state.boardDimentions.y,
          board);

      for (var i = 0; i < columnData.found.length; i++) {
        if(columnData.found[i+1] === 0 && position.x < i+1){
          position.x++;
          drop++;
        }
      }
    }



    if(board[position.x][position.y] === 0){
      board[position.x][position.y] = players[currentPlayer].value;
      this.setState({
        ...this.state,
        boardValues: board,
        moves: this.state.moves+1,
        lastPosition: {
          x: position.x,
          y: position.y
        },
        drop: {
          height: drop+x,
          x: position.x,
          y: position.y
        },
      }, () => {
        let winnerCells = [];
        let winnerFound = this.findWinner();

        if(winnerFound.length >= 1){
          for (var i = 0; i < winnerFound.length; i++) {
            winnerCells = winnerCells.concat(winnerFound[i].scanned);
          }
        }

        if(!winnerFound.length){
          this.switchPlayer();
        } else {
          this.setState({
            ...this.state,
            game: {
              winnerFound: true,
              winner: currentPlayer,
              moves: 0
            },
            winningCells: winnerCells,
          });
        }
      });
    }
  }

  handleStyle(e){
    this.setState({
      ...this.state,
      hasGravity: e.target.checked
    });
  }

  getCurrentPlayerAttributes(x,y){
    if(this.state.boardValues.length){
      if(this.state.boardValues[x][y] !== 0){
        let playerIndex = this.state.players.findIndex(
             player => player.value === this.state.boardValues[x][y]);
        return this.state.players[playerIndex];
      }
    }
  }


  isWinningCell(x,y){
    if(this.state.winningCells.find(cell => cell[0] === x && cell[1] === y)){
      return true;
    }
    return false;
  }

  createBoard(){
    let board = [];
    let winningCells = this.state.winningCells;

    for (var i = 0; i < this.state.boardDimentions.y; i++) {
      let cells = [];
      for (var idx = 0; idx < this.state.boardDimentions.x; idx++) {
        let cellKey = ''+idx+'-'+i;
        let highlights = [];
        if(winningCells.length){
          if(this.isWinningCell(idx,i)){
            highlights.push('winner');
          }
        }

        let cellInfo = this.getCurrentPlayerAttributes(idx,i);
        let value, style;
        if(cellInfo){
          value = cellInfo.display;
          style = {color: cellInfo.color}
        }
        cells.push(<Cell
          x={idx}
          y={i}
          key={cellKey}
          highlights={highlights}
          onClick={this.handleCellChange}
          value={value}
          style={style}
          hasDrops={this.props.hasDrops}
          drop={this.state.drop}
          decoration={false}
        />);
      }
      board.push(<div key={(''+i)} className="column">{cells}</div>)
    }
    return board;
  }

  static getDerivedStateFromProps(nextProps, prevState){

    if(
      nextProps.gameName !== prevState.gameName ||
      nextProps.boardDimentions !== prevState.boardDimentions ||
      nextProps.winMax !== prevState.winMax ||
      nextProps.hasGravity !== prevState.hasGravity ||
      nextProps.players !== prevState.players
    ){
      return {
        ...prevState,
        gameName: nextProps.name,
        boardDimentions: {
          x: nextProps.boardDimentions.x,
          y: nextProps.boardDimentions.y,
          cells: nextProps.boardDimentions.x * nextProps.boardDimentions.y
        },
        winMax: nextProps.win,
        hasGravity: nextProps.hasGravity,
        players: nextProps.players
      }
    } else {
      return null;
    }

  }

  componentDidMount(){
    this.setDimentions(this.state.boardDimentions.x,this.state.boardDimentions.y)
  }

  componentDidUpdate(){
    setTimeout(() => {
      if(this.state.game.winnerFound){
        //let player = this.state.players[this.state.game.winner];
        //alert('The winner is: Player ' + (parseInt(this.state.game.winner,10)+1));
        //this.resetBoard();
      } else {
        if(this.state.moves === this.state.boardDimentions.cells){
          //alert('The game is a draw!');
          //this.resetBoard();
        }
      }
    }, 5000);
  }

  render(){
    let boardSize = this.state.boardDimentions;
    let currentPlayer = this.state.currentPlayer;
    let currentPlayerNumber = currentPlayer+1;
    let boardClasses = ['current-board'];
    if(this.state.game.winnerFound){
      boardClasses.push('hasWinner');
    }

    return (
      <div className='game-board'>
        <div>

          <h3>Game: {this.state.gameName} </h3>
          <div>Board size: {boardSize.x} X {boardSize.y} <br />
          Has Gravity:
            <input
              type='checkbox'
              value={this.state.hasGravity}
              checked={this.state.hasGravity}
              onChange={this.handleStyle.bind(this)} /> <br/>
            Has Drops: {((this.props.hasDrops) ? 'Yes' : 'No') }<br />
            Current Player: {currentPlayerNumber} <br />
              {this.state.players[currentPlayer].display} <br />
            Moves {this.state.moves} of {boardSize.cells} <br />
             <button  style={{textAlign: 'center', margin: '10px'}} onClick={this.resetBoard}>Reset</button>
          </div>

        </div>
        <div className={boardClasses.join(' ')}>
          {this.createBoard()}
        </div>
      </div>
    )
  }
}

export default BoardGame;
