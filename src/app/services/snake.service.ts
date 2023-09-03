import { Injectable } from '@angular/core';
import { Position } from 'src/app/shared/interfaces/position';
import { ModelService } from 'src/app/types/model.service';
import { AppConstants } from '../shared/constants/constants';
import { InputService } from './input.service';
import { ObstaclesService } from './obstacles.service';

@Injectable({
  providedIn: 'root',
})
export class SnakeService {
  private newSegments: number = 0;

  constructor(
    private readonly m: ModelService,
    private readonly input: InputService,
    private readonly obstacles: ObstaclesService,
  ) {}

  listenToInputs(): void {
    this.input.getInputs();
  }

  update(): void {
    this.moveSnakeBody();
    this.updateSnakeHead();
    this.checkSnakeIntersection();
  }

  draw(gameBoard: any): void {
    this.m.snakeBody.forEach((segment, i) => {
      const snakeElement = document.createElement('div');
      snakeElement.style.gridRowStart = segment.y.toString();
      snakeElement.style.gridColumnStart = segment.x.toString();
      snakeElement.classList.add('snake');
      snakeElement.style.transform = 'rotate(' + this.m.headTurn + 'deg)';
      if (!i) {
        snakeElement.classList.add('head');
        snakeElement.style.transform = 'rotate(' + this.m.headTurn + 'deg)';
      }
      gameBoard.appendChild(snakeElement);
    });
  }

  expandSnake(): void {
    this.newSegments += 1;
  }

  snakeIntersection(): number {
    for (let i = 1; i < this.m.snakeBody.length; i++) {
      if (this.equalPositions(this.m.snakeBody[0], this.m.snakeBody[i]))
        return i;
    }
    return 0;
  }

  onSnake(): boolean {
    return this.m.snakeBody.some((segment: Position) => {
      return this.equalPositions(segment, this.m.foodPosition);
    });
  }

  equalPositions(pos1: Position, pos2: Position): boolean {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }

  addSegments(): void {
    for (let i = 0; i < this.newSegments; i++) {
      this.m.snakeBody.push({
        ...this.m.snakeBody[this.m.snakeBody.length - 1],
      });
    }
    this.newSegments = 0;
  }

  private moveSnakeBody(): void {
    this.addSegments();
    for (let i: number = this.m.snakeBody.length - 1; i > 0; i--) {
      this.m.snakeBody[i] = { ...this.m.snakeBody[i - 1] };
    }
  }

  private updateSnakeHead(): void {
    const inputDirection: Position = this.input.getInputDirection();
    const newHeadX: number =
      ((this.m.snakeBody[0].x + inputDirection.x + AppConstants.gridSizeX - 1) %
        AppConstants.gridSizeX) +
      1;
    const newHeadY: number =
      ((this.m.snakeBody[0].y + inputDirection.y + AppConstants.gridSizeY - 1) %
        AppConstants.gridSizeY) +
      1;
    if (
      (this.m.level < 5 &&
        this.outsideGrid(this.m.snakeBody[0], { x: newHeadX, y: newHeadY })) ||
      this.obstacles.checkObstacleCollision(this.m.snakeBody[0])
    ) {
      this.m.gameOver = true;
    }
    this.m.snakeBody[0] = { x: newHeadX, y: newHeadY };
  }

  private outsideGrid(position1: Position, position2: Position): boolean {
    return (
      (position1.x === 1 && position2.x === AppConstants.gridSizeX) ||
      (position1.x === AppConstants.gridSizeX && position2.x === 1) ||
      (position1.y === 1 && position2.y === AppConstants.gridSizeY) ||
      (position1.y === AppConstants.gridSizeY && position2.y === 1)
    );
  }

  private checkSnakeIntersection(): void {
    const intersectionIndex: number = this.snakeIntersection();
    if (intersectionIndex) {
      if (this.m.level < 10) this.m.gameOver = true;
      else {
        this.m.eatSnakeSound.play();
        this.m.snakeBody.splice(Number(intersectionIndex));
        this.m.score = this.m.snakeBody.length - 1;
        this.m.levelUpdate();
      }
    }
  }
}
