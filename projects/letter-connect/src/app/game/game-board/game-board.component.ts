import { Component, OnInit } from '@angular/core';
import { GameState } from '../engine/game-state';
import { GameService } from '../game.service';
import { AttemptResult, Engine } from '../engine/engine';

@Component({
    selector: 'app-game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit {
    public gameState: GameState | undefined;

    public get longestWordSize(): number {
        if (!this.gameState) {
            return 0;
        }

        return Math.max(...this.gameState.currentLevel.crossword.words.map((w) => w.word.length));
    }

    public get smallestWordSize(): number {
        if (!this.gameState) {
            return 0;
        }

        return Math.min(...this.gameState.currentLevel.crossword.words.map((w) => w.word.length));
    }

    constructor(private gameService: GameService) {}

    ngOnInit(): void {
        this.gameService.state$.subscribe((s) => (this.gameState = s));
    }

    public attempt(word: string) {
        if (!this.gameState) {
            return;
        }

        const result = Engine.attempt(this.gameState, word);

        switch (result) {
            case AttemptResult.NotFound:
                console.log(AttemptResult.NotFound);
                break;
            case AttemptResult.Found:
                console.log(AttemptResult.Found);
                break;
            case AttemptResult.AlreadyFound:
                console.log(AttemptResult.AlreadyFound);
                break;
        }
    }
}
