import React, { Component } from 'react';
import './Cell.css';

class Cell extends Component {

  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    e.preventDefault();
    this.props.onClick(this.props.id)
  }

  render() {

    const valueClass = (this.props.value !== '') ? 'grow' : '';

    return (
        <div
          id={this.props.id}
          className={this.props.className}
          onClick={this.handleClick}>
          <div className={`boardgame-cell ${valueClass}`} style={this.props.style}>
            {this.props.value}
          </div>
        </div>
    );
  }

}

export default Cell;
