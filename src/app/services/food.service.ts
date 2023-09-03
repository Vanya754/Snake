import { Injectable } from '@angular/core';
import { Position } from 'src/app/shared/interfaces/position';
import { AppConstants } from '../shared/constants/constants';
import { ModelService } from '../types/model.service';
import { PositionGeneratorService } from './position-generator.service';
import { SnakeService } from './snake.service';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(
    private readonly m: ModelService,
    private readonly snake: SnakeService,
    private readonly positionGeneratorService: PositionGeneratorService,
  ) {
    this.m.foodPosition = this.getRandomFoodPosition();
  }

  set addScore(val: number) {
    this.m.score += val;
    this.m.levelUpdate();
    if (this.m.score > this.m.bestScore) {
      this.m.bestScore = this.m.score;
      localStorage.setItem(
        AppConstants.localStorageRecordKey,
        this.m.bestScore.toString(),
      );
    }
  }

  update(): void {
    if (this.snake.onSnake()) {
      this.snake.expandSnake();
      this.m.foodPosition = this.getRandomFoodPosition();
      this.addScore = 1;
      this.m.eatFoodSound.play().then();
    }
  }

  draw(gameBoard: any): void {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.m.foodPosition.y.toString();
    foodElement.style.gridColumnStart = this.m.foodPosition.x.toString();
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
  }

  getRandomFoodPosition(): Position {
    return this.positionGeneratorService.getRandomGridPosition();
  }
}
