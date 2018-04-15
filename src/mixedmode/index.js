import React, { Component } from 'react';
import Scene from './Scene';
import Audio from './Audio';
import Track from './Track';
import ButtonWrapper from './ButtonWrapper';
import Button from './Button';

class MixedMode extends Component {
  loadCount = 0;
  state = {
    analyser: null,
    bass: false,
    synth: false,
    chords: false,
    drums: false,
    loaded: false,
  };
  toggleTrack = name => {
    this.setState({
      [name]: !this.state[name],
    });
  };
  registerAnalyser = analyser => {
    this.setState({
      analyser,
    });
  };
  onLoad = () => {
    this.loadCount++;

    if (this.loadCount === 4) {
      this.setState({
        loaded: true,
      });
    }
  };
  render() {
    return (
      <React.Fragment>
        <Scene
          backgroundPath="textures/cube/blue/"
          analyser={this.state.analyser}
        />
        <Audio
          registerAnalyser={this.registerAnalyser}
          play={this.state.loaded}
        >
          <Track
            path="/sounds/bass.wav"
            on={this.state.bass}
            onLoad={this.onLoad}
          />
          <Track
            path="/sounds/synth.wav"
            on={this.state.synth}
            onLoad={this.onLoad}
          />
          <Track
            path="/sounds/chords.wav"
            on={this.state.chords}
            onLoad={this.onLoad}
          />
          <Track
            path="/sounds/drums.wav"
            on={this.state.drums}
            onLoad={this.onLoad}
          />
        </Audio>
        <ButtonWrapper>
          <Button
            action={this.toggleTrack.bind(null, 'bass')}
            active={this.state.bass}
          >
            Bass
          </Button>
          <Button
            action={this.toggleTrack.bind(null, 'synth')}
            active={this.state.synth}
          >
            Synth
          </Button>
          <Button
            action={this.toggleTrack.bind(null, 'chords')}
            active={this.state.chords}
          >
            Chords
          </Button>
          <Button
            action={this.toggleTrack.bind(null, 'drums')}
            active={this.state.drums}
          >
            Drums
          </Button>
        </ButtonWrapper>
      </React.Fragment>
    );
  }
}

export default MixedMode;
