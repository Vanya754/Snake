import { Injectable } from '@angular/core';
import { Position } from 'src/app/shared/interfaces/position';
import { ModelService } from '../types/model.service';
import { PositionGeneratorService } from './position-generator.service';

@Injectable({
  providedIn: 'root',
})
export class ObstaclesService {
  constructor(
    private readonly m: ModelService,
    private readonly positionGeneratorService: PositionGeneratorService,
  ) {}

  update(): void {
    while (this.m.obstacles.length < this.m.requiredObstacles) {
      this.generateAndAddObstacle();
    }
    while (this.m.obstacles.length > this.m.requiredObstacles) {
      this.m.obstacles.pop();
    }
  }

  draw(gameBoard: any): void {
    this.m.obstacles.forEach((position) => {
      const obstacleElement = document.createElement('div');
      obstacleElement.style.gridRowStart = position.y.toString();
      obstacleElement.style.gridColumnStart = position.x.toString();
      obstacleElement.classList.add('obstacle');
      gameBoard.appendChild(obstacleElement);
    });
  }

  generateAndAddObstacle(): void {
    this.m.obstacles.push(
      this.positionGeneratorService.getRandomGridPosition(),
    );
  }

  checkObstacleCollision(position: Position): boolean {
    return this.m.obstacles.some(
      (obstacle) => obstacle.x === position.x && obstacle.y === position.y,
    );
  }
}
