import { Injectable } from '@angular/core';
import { ModelService } from 'src/app/types/model.service';
import { AppConstants } from '../shared/constants/constants';
import { Position } from '../shared/interfaces/position';

@Injectable({ providedIn: 'root' })
export class PositionGeneratorService {
  private readonly excludeRadius: number = 5;
  private readonly maxX: number;
  private readonly maxY: number;

  constructor(private readonly m: ModelService) {
    this.maxX = AppConstants.gridSizeX;
    this.maxY = AppConstants.gridSizeY;
  }

  getRandomGridPosition(): Position {
    let newPosition: Position;
    do {
      newPosition = this.generateRandomPosition();
    } while (this.isInvalidPosition(newPosition));

    return newPosition;
  }

  private generateRandomPosition(): Position {
    return {
      x: Math.floor(Math.random() * this.maxX) + 1,
      y: Math.floor(Math.random() * this.maxY) + 1,
    };
  }

  private isInvalidPosition(position: Position): boolean {
    return (
      this.isOccupiedPosition(
        position,
        [this.m.snakeBody[0]],
        this.excludeRadius,
      ) ||
      this.isOccupiedPosition(position, this.m.snakeBody) ||
      this.isOccupiedPosition(position, this.m.obstacles) ||
      this.isOccupiedPosition(position, [this.m.foodPosition])
    );
  }

  private isOccupiedPosition(
    position: Position,
    elements: Position[],
    excludeRadius = 0,
  ): boolean {
    return elements.some(
      (element) =>
        Math.abs(element.x - position.x) <= excludeRadius &&
        Math.abs(element.y - position.y) <= excludeRadius,
    );
  }
}
