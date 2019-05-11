import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../models';

@Injectable()
export class TrackService {
  private imageSource = '../assets/images/';
  private audioSource = '../assets/audio/';

  tracks: Track[] = [
    {
      artist: 'Violet Cold',
      album: 'kOsmik',
      name: 'Contact',
      src: `${this.audioSource}contact.mp3`,
      img: `${this.imageSource}kOsmik.jpg`
    },
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

  nextTrack = (): Track => {
    let index = this.tracks.indexOf(this.track.value);
    index = index >= this.tracks.length - 1 ? 0 : ++index;
    this.track.next(this.tracks[index]);
    return this.tracks[index];
  }

  previousTrack = (): Track => {
    let index = this.tracks.indexOf(this.track.value);
    index = index === 0 ? this.tracks.length - 1 : --index;
    this.track.next(this.tracks[index]);
    return this.tracks[index];
  }
}
