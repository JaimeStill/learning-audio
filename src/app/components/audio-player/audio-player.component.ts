import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import { Track } from '../../models';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'audio-player',
  templateUrl: 'audio-player.component.html'
})
export class AudioPlayerComponent implements OnInit {
  @Input() track: Track;
  @Input() width = 420;
  @Input() imgWidth = 400;
  @Input() progress: number;
  @Input() duration: number;
  @Input() gain: number;
  @Input() playing: boolean;
  @Input() muted: boolean;
  @Input() elevated = true;

  @Output() initialized = new EventEmitter<HTMLAudioElement>();
  @Output() togglePlay = new EventEmitter();
  @Output() toggleMute = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() scan = new EventEmitter<number>();
  @Output() volume = new EventEmitter<number>();

  @ViewChild('player') player: ElementRef<HTMLAudioElement>;

  ngOnInit() {
    this.initialized.emit(this.player.nativeElement);
  }

  updateVolume = (event: MatSliderChange) => this.volume.emit(event.value);
  scanTrack = (event: MatSliderChange) => this.scan.emit(event.value);
}
