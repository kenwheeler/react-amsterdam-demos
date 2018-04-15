import React, { PureComponent } from 'react';
import { Consumer } from './Context';

const genID = () =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9);

class BallElement extends PureComponent {
  id = genID();
  handleClick = () => {
    this.props.onClick && this.props.onClick();
  };
  componentDidMount() {
    setTimeout(() => {
      this.props.addMesh({
        callback: this.handleClick,
        id: this.id,
      });
    }, 50);
  }
  componentWillUnmount() {
    this.props.removeMesh(this.id);
  }
  render() {
    return <span />;
  }
}

class Ball extends PureComponent {
  render() {
    return (
      <Consumer>
        {({ addMesh, removeMesh }) => (
          <BallElement
            {...this.props}
            addMesh={addMesh}
            removeMesh={removeMesh}
          />
        )}
      </Consumer>
    );
  }
}

export default Ball;
