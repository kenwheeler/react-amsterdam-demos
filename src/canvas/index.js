import React, { Component } from 'react';
import Canvas from './Canvas';
import Box from './Box';

class CanvasDemo extends Component {
  mouseIsDown = false;
  initialX = null;
  initialY = null;
  downX = null;
  downY = null;
  state = {
    x: 5,
    y: 5,
  };
  handleMouseDown = ev => {
    this.mouseIsDown = true;
    this.initialX = ev.clientX;
    this.initialY = ev.clientY;
    this.downX = this.state.x;
    this.downY = this.state.y;
  };
  handleMouseUp = () => {
    this.mouseIsDown = false;
  };
  handleMouseMove = ev => {
    if (this.mouseIsDown) {
      this.setState(state => ({
        x: this.downX + (ev.clientX - this.initialX),
        y: this.downY + (ev.clientY - this.initialY),
      }));
    }
  };
  render() {
    return (
      <Canvas height={400} width={600}>
        <Box color="#6c5ce7" x={250} y={250} height={100} width={100} />
        <Box
          color="#fd79a8"
          x={this.state.x}
          y={this.state.y}
          height={100}
          width={100}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
        />
        <Box color="#00b894" x={150} y={150} height={100} width={100} />
      </Canvas>
    );
  }
}

export default CanvasDemo;
