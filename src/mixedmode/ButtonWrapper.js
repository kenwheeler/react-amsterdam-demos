import React, { Component } from 'react';

class ButtonWrapper extends Component {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-evenly',
          left: 0,
          bottom: 60,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default ButtonWrapper;
