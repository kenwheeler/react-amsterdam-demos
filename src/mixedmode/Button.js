import React, { Component } from 'react';

class Button extends Component {
  render() {
    return (
      <button
        type="button"
        onClick={this.props.action}
        style={{
          backgroundColor: this.props.active ? '#55efc4' : '#ff7675',
          border: '4px solid white',
          fontSize: 28,
          padding: 15,
          width: 200,
          textTransform: 'uppercase',
        }}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
