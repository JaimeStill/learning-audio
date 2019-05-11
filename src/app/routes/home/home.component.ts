import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  AudioService,
  TrackService,
  VisualizerService
} from '../../services';

import { Track } from 'src/app/models';

@Component({
  selector: 'home-route',
  templateUrl: './home.component.html',
  providers: [
    AudioService,
    TrackService,
    VisualizerService
  ]
})
export class HomeComponent {
  constructor(
    public audioService: AudioService,
    public trackService: TrackService,
    public visService: VisualizerService
  ) { }

  @ViewChild('visualizer')
  set visualizer(visualizer: ElementRef<HTMLCanvasElement>) {
    if (visualizer) {
      this.visService.initialize(visualizer.nativeElement);
      this.setOscillator();
    }
  }

  initializeAudio = (player: HTMLAudioElement, track: Track) => {
    this.audioService.initializeAudio(player, track);
    player.addEventListener('ended', () => this.next());
  }

  previous = () => this.audioService.setTrack(this.trackService.previousTrack());
  next = () => this.audioService.setTrack(this.trackService.nextTrack());

  setSpectrum = () => this.visService.spectrum(
    this.audioService.byteFrequencyData,
    this.audioService.updateByteFrequencyData
  );

  setOscillator = () => this.visService.oscillator(
    this.audioService.floatTimeDomainData,
    this.audioService.updateFloatTimeDomainData
  );
}
