import React, { PureComponent } from 'react';
import { Consumer } from './AudioContext';

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount === loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};

class TrackElement extends PureComponent {
  source: null;
  callback = t => {
    if (this.source) {
      const buffer = this.props.audioContext.createBufferSource();
      buffer.buffer = this.source;
      buffer.connect(this.gainNode);
      buffer.start(t);
    }
  };
  componentDidMount() {
    this.props.registerAudio(this.callback);
    const bufferLoader = new BufferLoader(
      this.props.audioContext,
      [this.props.path],
      this.finishedLoading
    );
    this.gainNode = this.props.audioContext.createGain();
    this.gainNode.gain.value = this.props.on ? 0.5 : 0;
    this.gainNode.connect(this.props.connectNode);
    bufferLoader.load();
  }
  componentDidUpdate() {
    this.gainNode.gain.value = this.props.on ? 0.5 : 0;
  }
  finishedLoading = bufferList => {
    this.source = bufferList[0];
    this.props.onLoad();
  };
  render() {
    return null;
  }
}

class Track extends PureComponent {
  render() {
    return (
      <Consumer>
        {({ audioContext, registerAudio, connectNode }) => (
          <TrackElement
            {...this.props}
            audioContext={audioContext}
            registerAudio={registerAudio}
            connectNode={connectNode}
          />
        )}
      </Consumer>
    );
  }
}

export default Track;
