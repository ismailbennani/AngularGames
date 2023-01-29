import { Component, HostListener, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { GameOverResult } from './engine/engine';
import { GameState } from './engine/game-state';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    public levelOver: boolean = false;
    public won: boolean = false;

    constructor(private gameService: GameService) {}

    ngOnInit(): void {
        const game = this.gameService.getOrCreate();
        this.update(game);
        this.gameService.state$.subscribe((s) => this.update(s));
    }

    public next() {
        if (!this.levelOver) {
            return;
        }

        this.gameService.next();
    }

    private update(state: GameState) {
        this.levelOver = state.currentLevel.gameOver !== GameOverResult.NotOver;
        this.won = state.currentLevel.gameOver === GameOverResult.Won;
    }

    @HostListener('window:keyup.enter', ['$event'])
    private enterPressed(event: KeyboardEvent) {
        if (!this.levelOver) {
            return;
        }

        this.next();

        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}
