import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { InputService } from 'src/app/services/input.service';
import { ObstaclesService } from 'src/app/services/obstacles.service';
import { SnakeService } from 'src/app/services/snake.service';
import { AppConstants } from 'src/app/shared/constants/constants';
import { ModelService } from 'src/app/types/model.service';
import { FoodService } from '../../services/food.service';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    readonly m: ModelService,
    private readonly food: FoodService,
    private readonly snake: SnakeService,
    private readonly input: InputService,
    private readonly obstacles: ObstaclesService,
    private readonly timer: TimerService,
  ) {}

  get snakeSpeed(): number {
    return this.m.level < 10
      ? this.m.baseSpeed + this.m.level
      : this.m.baseSpeed + 10;
  }

  ngOnInit(): void {
    this.m.bestScore =
      Number(localStorage.getItem(AppConstants.localStorageRecordKey)) || 0;
    this.snake.listenToInputs();
    this.m.timerSubscription = interval(1000).subscribe(() => {
      if (this.m.gameOver !== undefined) this.timer.updateTime();
    });
  }

  ngAfterViewInit(): void {
    this.m.gameBoard = document.querySelector(
      AppConstants.containerSelector,
    ) as HTMLDivElement;
    if (!this.m.gameBoard)
      throw new Error(
        `Can't find container with selector "${AppConstants.containerSelector}"`,
      );
    window.requestAnimationFrame(this.start.bind(this));

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') this.togglePause();
      if (event.code === 'KeyR') this.restart();
    });
  }

  ngOnDestroy(): void {
    this.m.timerSubscription.unsubscribe();
  }

  start(currentTime: any): void {
    if (this.m.isPaused) return;

    if (this.m.gameOver) {
      return console.log('Game Over');
    }
    window.requestAnimationFrame(this.start.bind(this));
    const secondsSinceLastRender = (currentTime - this.m.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / this.snakeSpeed) return;
    this.m.lastRenderTime = currentTime;
    this.update();
    if (!this.m.gameOver) this.draw();
  }

  togglePause(): void {
    if (this.m.isPaused) {
      this.timer.resumeTimer();
      this.start(performance.now());
    } else this.timer.pauseTimer();
  }

  dPadMovement(direction: string): void {
    this.input.setDirection(direction);
  }

  update(): void {
    this.snake.update();
    this.food.update();
    this.obstacles.update();
    this.checkDeath();
  }

  draw(): void {
    this.m.gameBoard.innerHTML = '';
    this.snake.draw(this.m.gameBoard);
    this.food.draw(this.m.gameBoard);
    this.obstacles.draw(this.m.gameBoard);
  }

  checkDeath(): void {
    if (!this.m.gameOver) return;
    this.m.deathSound.play();
    this.m.gameBoard.classList.add('blur');
  }

  restart(): void {
    window.location.reload();
  }
}
