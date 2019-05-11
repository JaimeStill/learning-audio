import { Injectable } from '@angular/core';
import { Track } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AudioService {
  private imageSource = '../assets/images/';
  private audioSource = '../assets/audio/';

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

  tracks: Track[] = [
    {
      artist: 'Violet Cold',
      album: 'kOsmik',
      name: 'Black Sun',
      src: `${this.audioSource}black-sun.mp3`,
      img: `${this.imageSource}kOsmik.jpg`
    },
    {
      artist: 'Violet Cold',
      album: 'kOsmik',
      name: 'Mamihlapinatapai',
      src: `${this.audioSource}mamihlapinatapai.mp3`,
      img: `${this.imageSource}kOsmik.jpg`
    },
    {
      artist: 'Violet Cold',
      album: 'Sommermorgen III - Nostalgia',
      name: 'Sommermorgen',
      src: `${this.audioSource}sommermorgen.mp3`,
      img: `${this.imageSource}sommermorgen.jpg`
    },
    {
      artist: 'Violet Cold',
      album: 'Sommermorgen III - Nostalgia',
      name: 'Ein Hauch Von Ewigkeit',
      src: `${this.audioSource}ein-hauch-von-ewigkeit.mp3`,
      img: `${this.imageSource}sommermorgen.jpg`
    },
    {
      artist: 'Violet Cold',
      album: 'Derealization',
      name: 'Derealization',
      src: `${this.audioSource}derealization.mp3`,
      img: `${this.imageSource}derealization.jpg`
    },
    {
      artist: 'Violet Cold',
      album: 'Magic Night',
      name: 'Everything You Can Imagine Is Real',
      src: `${this.audioSource}everything-you-can-imagine-is-real.mp3`,
      img: `${this.imageSource}magic-night.jpg`
    },
    {
      artist: 'Violet Cold',
      album: 'Magic Night',
      name: 'Sea',
      src: `${this.audioSource}sea.mp3`,
      img: `${this.imageSource}magic-night.jpg`
    }
  ];

  private track = new BehaviorSubject<Track>(this.tracks[0]);
  track$ = this.track.asObservable();
  progress = 0;
  duration = 0;

  private configureAudioElement = (audio: HTMLAudioElement) => {
    this.audio = audio;
    this.audio.src = this.track.value.src;
    this.audio.addEventListener('durationchange', () => this.duration = this.audio.duration);
    this.audio.addEventListener('ended', () => this.nextTrack());
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

  updateByteFrequencyDataListener = () =>
    this.analyser.getByteFrequencyData(this.byteFrequencyData);

  updateFloatTimeDomainData = () =>
    this.analyser.getFloatTimeDomainData(this.floatTimeDomainData);

  updateFloatFrequencyData = () =>
    this.analyser.getFloatFrequencyData(this.floatFrequencyData);

  initializeAudio = (audio: HTMLAudioElement) => {
    this.configureAudioElement(audio);
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

  nextTrack = () => {
    let index = this.tracks.indexOf(this.track.value);
    index = index >= this.tracks.length - 1 ? 0 : ++index;
    this.track.next(this.tracks[index]);
    this.setTrack();
  }

  previousTrack = () => {
    let index = this.tracks.indexOf(this.track.value);
    index = index === 0 ? this.tracks.length - 1 : --index;
    this.track.next(this.tracks[index]);
    this.setTrack();
  }

  selectTrack = (track: Track) => {
    this.track.next(track);
    this.setTrack();
  }

  setTrack = () => {
    this.playing && this.audio.pause();
    this.audio.src = this.track.value.src;
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
