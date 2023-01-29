import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { GameOverResult } from './engine/engine';
import { GameState } from './engine/game-state';
import { GameLevelDifficulty } from './engine/game-level-state';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    public gameOver: GameOverResult = GameOverResult.NotOver;

    constructor(private gameService: GameService) {}

    ngOnInit(): void {
        this.gameService.state$.subscribe((s) => this.update(s));
    }

    public next(difficulty: string) {
        this.gameService.next(difficulty as GameLevelDifficulty);
    }

    private update(state: GameState) {
        this.gameOver = state.currentLevel.gameOver;
    }
}
