import { Injectable } from '@angular/core';
import { Track, } from '../models';

@Injectable()
export class AudioService {
  bufferLength: number;
  floatTimeDomainData: Float32Array;
  floatFrequencyData: Float32Array;
  byteFrequencyData: Uint8Array;
  byteTimeDomainData: Uint8Array;
  audio: HTMLAudioElement;
  context: AudioContext;
  audioNode: AudioNode;
  gainNode: GainNode;
  analyser: AnalyserNode;
  gain = 1;
  gainValue = 1;
  muted = false;
  playing = false;
  progress = 0;
  duration = 0;

  private configureAudioElement = (audio: HTMLAudioElement, track: Track) => {
    this.audio = audio;
    this.audio.src = track.src;
    this.audio.addEventListener('durationchange', () => this.duration = this.audio.duration);
    this.audio.addEventListener('timeupdate', () => this.progress = this.audio.currentTime);
  }

  private setupContextAndNodes = () => {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.analyser = this.context.createAnalyser();
  }

  private connectDestination = () => {
    const trackNode = this.context.createMediaElementSource(this.audio);
    trackNode.connect(this.gainNode)
             .connect(this.analyser)
             .connect(this.context.destination);
  }

  private setupAnalyserSources = () => {
    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.byteTimeDomainData = new Uint8Array(this.bufferLength);
    this.byteFrequencyData = new Uint8Array(this.bufferLength);
    this.floatTimeDomainData = new Float32Array(this.bufferLength);
    this.floatFrequencyData = new Float32Array(this.bufferLength);
  }

  updateByteTimeDomainData = () =>
    this.analyser.getByteTimeDomainData(this.byteTimeDomainData);

  updateByteFrequencyData = () =>
    this.analyser.getByteFrequencyData(this.byteFrequencyData);

  updateFloatTimeDomainData = () =>
    this.analyser.getFloatTimeDomainData(this.floatTimeDomainData);

  updateFloatFrequencyData = () =>
    this.analyser.getFloatFrequencyData(this.floatFrequencyData);

  initializeAudio = (audio: HTMLAudioElement, track: Track) => {
    this.configureAudioElement(audio, track);
    this.setupContextAndNodes();
    this.connectDestination();
    this.setupAnalyserSources();
  }

  togglePlayback = async () => {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    if (this.playing) {
      await this.audio.pause();
      this.playing = false;
    } else {
      await this.audio.play();
      this.playing = true;
    }
  }

  setTrack = (track: Track) => {
    this.playing && this.audio.pause();
    this.audio.src = track.src;
    this.playing && this.audio.play();
  }

  updateVolume = (val: number) => {
    this.gainValue = val > 2 ?
    2 : val < 0 ? 0 : val;

    if (!this.muted) {
      this.gainNode.gain.value = this.gainValue;
      this.gain = this.gainValue;
    }
  }

  scanTrack = (val: number) => {
    this.audio.currentTime = val;
    this.progress = val;
  }

  toggleMute = () => {
    this.muted = !this.muted;
    this.muted ? this.gainNode.gain.value = 0 : this.gainNode.gain.value = this.gainValue;
    this.gain = this.gainNode.gain.value;
  }
}
