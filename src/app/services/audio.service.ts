import { Injectable } from '@angular/core';
import { Track } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AudioService {
  private imageSource = '../assets/images/';
  private audioSource = '../assets/audio/';

  audio: HTMLAudioElement;
  context: AudioContext;
  trackNode: MediaElementAudioSourceNode;
  gainNode: GainNode;
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

  initializeAudio = (audio: HTMLAudioElement) => {
    this.audio = audio;
    this.audio.src = this.track.value.src;
    this.audio.addEventListener('durationchange', () => this.duration = this.audio.duration);
    this.audio.addEventListener('timeupdate', () => this.progress = this.audio.currentTime);
    this.context = new AudioContext();
    this.trackNode = this.context.createMediaElementSource(this.audio);
    this.gainNode = this.context.createGain();

    this.trackNode
      .connect(this.gainNode)
      .connect(this.context.destination);

    this.audio.addEventListener('ended', () => this.nextTrack());
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
