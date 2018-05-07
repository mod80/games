import React, { Component } from 'react';
import './Cell.css';

class Cell extends Component {

  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    e.preventDefault();
    this.props.onClick(this.props.x,this.props.y)
  }

  render() {
    let classes = ['boardgame-cell'];
    let token = this.props.value;
    classes = classes.concat(this.props.highlights);
    if(this.props.drop && this.props.drop.hasOwnProperty('x')){
      if(
          this.props.drop.x === this.props.x &&
          this.props.drop.y === this.props.y &&
          this.props.drop.height > 0 &&
          this.props.hasDrops
        ){
        classes.push('drop');
        token = <div className={`drop drop-${this.props.drop.height}`}>{this.props.value}</div>
      }
    }

    return (
        <div
          className='square'
          onClick={this.handleClick}>
          <div className={classes.join(' ')} style={this.props.style}>
            {token}
          </div>
        </div>
    );
  }

}

export default Cell;
