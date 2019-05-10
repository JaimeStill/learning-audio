import { Component } from '@angular/core';
import { AudioService } from '../../services';

@Component({
  selector: 'home-route',
  templateUrl: './home.component.html',
  providers: [AudioService]
})
export class HomeComponent {
  constructor(
    public service: AudioService
  ) { }

  initializeAudio = (player: HTMLAudioElement) => this.service.initializeAudio(player);
}
