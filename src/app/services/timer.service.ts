import { Injectable } from '@angular/core';
import { ModelService } from '../types/model.service';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private startTime!: number;

  constructor(private readonly m: ModelService) {}

  pauseTimer(): void {
    if (!this.m.isPaused) this.m.isPaused = true;
  }

  resumeTimer(): void {
    if (this.m.isPaused && !this.m.gameOver) {
      this.startTime = performance.now() - this.m.time * 1000;
      this.m.isPaused = false;
    }
  }

  updateTime(): void {
    if (!this.m.isPaused) {
      if (this.startTime === undefined) this.startTime = performance.now() - 1;
      const currentTime = performance.now();
      this.m.time = Math.floor((currentTime - this.startTime) / 1000);
    }
  }
}
