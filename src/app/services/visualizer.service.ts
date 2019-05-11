import { Injectable } from '@angular/core';

@Injectable()
export class VisualizerService {
  canvas: CanvasRenderingContext2D;
  width: number;
  height: number;

  initialize = (canvas: CanvasRenderingContext2D, width: number, height: number) => {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
  }

  oscillator = (data: Float32Array, update: () => void) => {
    const draw = () => {
      requestAnimationFrame(draw);
      update();
      this.canvas.clearRect(0, 0, this.width, this.height);
      this.canvas.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = i;
        const y = (0.5 + data[i] / 2) * this.height;
        this.updateCanvas(i, x, y);
      }
      this.canvas.stroke();
    }
    draw();
  }

  private updateCanvas = (i: number, x: number, y: number) => i === 0 ?
    this.canvas.moveTo(x, y) :
    this.canvas.lineTo(x, y);
}
