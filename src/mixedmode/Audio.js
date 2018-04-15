import React, { Component } from 'react';
import { Provider } from './AudioContext';
import Scheduler from 'web-audio-scheduler';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

class Audio extends Component {
  playing = false;
  audioContext = new AudioContext();
  analyser = this.audioContext.createAnalyser();
  tracks = [];
  componentDidMount() {
    this.barInterval = 60000 / 110 * 4;
    this.scheduler = new Scheduler({
      context: this.audioContext,
    });
    this.analyser.connect(this.audioContext.destination);
    this.props.registerAnalyser(this.analyser);
  }
  componentDidUpdate() {
    if (this.props.play && this.playing === false) {
      this.scheduler.start(this.loop);
      this.playing = true;
    }
  }
  registerAudio = callback => {
    this.tracks.push(callback);
  };
  contextValue = {
    audioContext: this.audioContext,
    registerAudio: this.registerAudio,
    connectNode: this.analyser,
  };
  loop = e => {
    Object.keys(this.tracks).forEach(id => {
      const callback = this.tracks[id];
      callback(e.playbackTime);
    });
    this.scheduler.insert(
      e.playbackTime + this.barInterval * 8 / 1000,
      this.loop
    );
  };
  render() {
    return (
      <Provider value={this.contextValue}>
        <div>{this.props.children}</div>
      </Provider>
    );
  }
}

export default Audio;
