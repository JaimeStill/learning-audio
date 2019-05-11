import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  AudioService,
  VisualizerService
} from '../../services';

@Component({
  selector: 'home-route',
  templateUrl: './home.component.html',
  providers: [AudioService, VisualizerService]
})
export class HomeComponent {
  constructor(
    public service: AudioService,
    private visService: VisualizerService
  ) { }

  @ViewChild('visualizer')
  set visualizer(visualizer: ElementRef<HTMLCanvasElement>) {
    if (visualizer) {
      this.visService.initialize(
        visualizer.nativeElement.getContext('2d'),
        visualizer.nativeElement.width,
        visualizer.nativeElement.height
      );

      this.visService.oscillator(
        this.service.floatTimeDomainData,
        this.service.updateFloatTimeDomainData
      );
    }
  }

  initializeAudio = (player: HTMLAudioElement) => {
    this.service.initializeAudio(player);
  };
}
