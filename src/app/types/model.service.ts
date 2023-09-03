import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Position } from 'src/app/shared/interfaces/position';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  timerSubscription!: Subscription;
  lastRenderTime: number = 0;
  requiredObstacles: number = 0;
  gameBoard!: HTMLDivElement;
  eatFoodSound: HTMLAudioElement = new Audio('assets/sounds/explosion.mp3');
  deathSound = new Audio('assets/sounds/game-over.mp3');
  eatSnakeSound = new Audio('assets/sounds/fire.mp3');

  readonly baseSpeed: number = 1;

  score: number = 0;
  bestScore: number = 0;
  time: number = 0;

  headTurn: number = 0;

  foodPosition: Position = { x: -5, y: -5 };
  snakeBody: Position[] = [{ x: 13, y: 6 }];
  obstacles: Position[] = [];

  private _level: number = 1;
  private _isPaused: boolean = false;
  private _gameOver!: boolean;

  get level(): number {
    return this._level;
  }

  set level(value: number) {
    if (value < 5) this.gameBoard.style.border = '5px solid red';
    else this.gameBoard.style.border = '5px solid blue';

    if (value >= 5) this.requiredObstacles = value;
    else this.requiredObstacles = 0;

    this._level = value;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  set isPaused(value: boolean) {
    this._isPaused = value;
  }

  get gameOver(): boolean {
    return this._gameOver;
  }

  set gameOver(value: boolean) {
    this._gameOver = value;
    if (value) this.isPaused = true;
  }

  levelUpdate(): void {
    this.level = Math.ceil(this.score + 1);
  }
}
