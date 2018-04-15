import React, { Component } from 'react';
import { Provider } from './Context';

class Canvas extends Component {
  canvasRef = React.createRef();
  state = {
    elements: {},
  };
  deleteElement = id => {
    this.setState(state => {
      const newState = { ...state };
      delete newState.elements[id];
      return newState;
    });
  };
  updateElement = el => {
    this.setState(state => {
      const newState = { ...state };
      newState.elements[el.id] = el;
      return newState;
    });
  };
  contextValue = {
    updateElement: this.updateElement,
    deleteElement: this.deleteElement,
  };
  draw = () => {
    const { elements } = this.state;
    const { current } = this.canvasRef;
    this.ctx.clearRect(0, 0, current.width, current.height);
    this.ctx.fillStyle = '#eee';
    this.ctx.fillRect(0, 0, current.width, current.height);
    Object.keys(elements).forEach(id => {
      elements[id].draw(this.ctx);
    });
  };
  handleMouseMove = event => {
    const { clientX, clientY } = event;
    this.respondToEvent({ clientX, clientY }, 'onMouseMove');
  };
  handleMouseDown = event => {
    const { clientX, clientY } = event;
    this.respondToEvent({ clientX, clientY }, 'onMouseDown');
  };
  handleMouseUp = event => {
    const { clientX, clientY } = event;
    this.respondToEvent({ clientX, clientY }, 'onMouseUp');
  };
  respondToEvent = (ev, evName) => {
    const { elements } = this.state;
    Object.keys(elements).forEach(id => {
      const { props } = elements[id];
      if (evName in props) {
        const pos = this.relativeMousePos(ev);
        let isInside = this.isInsideElement(pos, props);
        if (evName === 'onMouseMove' || isInside) {
          if (typeof props[evName] === 'function') {
            props[evName](ev);
          }
        }
      }
    });
  };
  isInsideElement = (pos, props) => {
    const { x, y } = pos;
    const { x: elX, y: elY, width, height } = props;

    return x >= elX && x <= elX + width && y >= elY && y <= elY + height;
  };
  relativeMousePos = evt => {
    const { current } = this.canvasRef;
    var rect = current.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };
  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext('2d');
    this.draw();
  }
  componentDidUpdate() {
    this.draw();
  }
  render() {
    const { height, width } = this.props;
    return (
      <Provider value={this.contextValue}>
        <canvas
          height={height}
          width={width}
          ref={this.canvasRef}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
        >
          {this.props.children}
        </canvas>
      </Provider>
    );
  }
}

export default Canvas;
