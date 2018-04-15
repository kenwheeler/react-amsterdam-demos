import React, { Component } from 'react';
import Scene from './Scene';
import Ball from './Ball';

class ThreeDemo extends Component {
  state = {
    ballCount: 0,
  };
  handleClick = () => {
    this.setState(state => ({
      ballCount: state.ballCount + 50,
    }));
  };
  handleKey = e => {
    if (e.key === 'd') {
      this.setState(state => ({
        ballCount: state.ballCount - 50,
      }));
    }
  };
  handleBallClick = i => {
    alert('BALLS');
  };
  componentDidMount() {
    document.addEventListener('keyup', this.handleKey);
  }
  render() {
    let balls = Array.from({ length: this.state.ballCount });
    return (
      <Scene onClick={this.handleClick} backgroundPath="textures/cube/street/">
        {balls.map((u, i) => {
          return <Ball key={i} onClick={this.handleBallClick} />;
        })}
      </Scene>
    );
  }
}

export default ThreeDemo;
