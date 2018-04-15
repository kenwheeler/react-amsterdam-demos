import React, { PureComponent } from 'react';
import { Consumer } from './Context';

const genID = () =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9);

class BoxElement extends PureComponent {
  id = genID();
  draw = ctx => {
    const { color, height, width, x, y } = this.props;
    ctx.fillStyle = color || 'green';
    ctx.fillRect(x, y, width, height);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.drawFocusIfNeeded(document.getElementById(this.id));
    ctx.restore();
  };

  componentDidMount() {
    this.props.updateElement({
      id: this.id,
      draw: this.draw,
      props: this.props,
    });
  }
  componentDidUpdate() {
    this.props.updateElement({
      id: this.id,
      draw: this.draw,
      props: this.props,
    });
  }
  handleFocusState = () => {
    this.forceUpdate();
  };
  render() {
    return (
      <input
        type="button"
        id={this.id}
        onFocus={this.handleFocusState}
        onBlur={this.handleFocusState}
      />
    );
  }
}

class Box extends PureComponent {
  render() {
    return (
      <Consumer>
        {({ updateElement, deleteElement }) => (
          <BoxElement
            {...this.props}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        )}
      </Consumer>
    );
  }
}

export default Box;
