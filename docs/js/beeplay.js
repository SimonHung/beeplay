(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.beeplay = function (option) {
  'use strict';

  var beeplay               = require('./modules/main');
  beeplay.prototype.isArray = require('./modules/isArray');
  beeplay.prototype.nn      = require('./modules/nn');
  beeplay.prototype.pn      = require('./modules/pn');
  beeplay.prototype.noteOn  = require('./modules/noteOn');
  beeplay.prototype.play    = require('./modules/play');

  return new beeplay(option);
};

},{"./modules/isArray":2,"./modules/main":3,"./modules/nn":4,"./modules/noteOn":5,"./modules/play":6,"./modules/pn":7}],2:[function(require,module,exports){
module.exports = function (vArg) {
  if(!Array.isArray) {
    return Object.prototype.toString.call(vArg) === '[object Array]';
  }
  return Array.isArray(vArg);
};

},{}],3:[function(require,module,exports){
// constructor
module.exports = function (option) {
  option = (typeof option === 'object') ? option : {};
  this.bpm = option.bpm || 120;
  this.sampleRate = option.sampleRate || 44100;
  this.time = 0;

  try {
    // Fix up for prefixing
    var AudioContext = window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext;
    this.context = window.__audioContext__ || new AudioContext();
    this.context.sampleRate = this.sampleRate;
    window.__audioContext__ = this.context;
  } catch(e) {
    console.error(e.message);
  }

  return this;
};

},{}],4:[function(require,module,exports){
// Get Note Number
module.exports = function (nn) {
  var keys = ['c', 'c#', 'd', 'd#', 'e',
      'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  var index = (nn.indexOf('#') !== -1) ? 2 : 1;
  var note = nn.substring(0, index).toLowerCase();
  var number = Number(nn.substring(index)) + 1;
  return keys.indexOf(note) + 12 * number;
};

},{}],5:[function(require,module,exports){
module.exports = function (notes, length) {
  var context = this.context;
  var sampleRate = this.sampleRate;
  var bpm = this.bpm;
  var that = this;
  notes.forEach(function(note) {
    var buf = context.createBuffer(1, sampleRate, sampleRate);
    var data = buf.getChannelData(0);
    var nn = that.pn(note);
    if (nn === -1) { return; }
    for(var i = 0; i < 60 / bpm * length * sampleRate; i++) {
      data[i]=Math.sin( (2 * Math.PI) * nn * (i / sampleRate) );
    }
    var src = context.createBufferSource();
    src.buffer = buf;
    src.connect(context.destination);
    src.start(that.time);
  });
  this.time += 60 / bpm * length;
  return this.time;
};

},{}],6:[function(require,module,exports){
module.exports = function (notes, length) {
  notes = this.isArray(notes) ? notes : [notes];
  this.noteOn(notes, length);
  return this;
};

},{}],7:[function(require,module,exports){
// Parse Note Number to freq
module.exports = function (note) {
    if (note === null) { return -1; }
    var nn = this.nn(note);
    var freq = this.sampleRate / 100;
    var diff = nn - 69;
    var i = Math.abs(diff);
    if (nn === 69) {
      return freq;
    } else if (diff > 0) {
      while(i--) freq = freq * Math.pow(2, 1 / 12);
    } else {
      while(i--) freq = freq / Math.pow(2, 1 / 12);
    }
    return freq;
  };

},{}]},{},[1,2,3,4,5,6,7])