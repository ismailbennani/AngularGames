import { Component, OnInit } from '@angular/core';
import { GameState } from '../engine/game-state';
import { GameService } from '../game.service';

@Component({
    selector: 'app-game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit {
    public gameState: GameState | undefined;

    constructor(private gameService: GameService) {}

    ngOnInit(): void {
        this.gameService.state$.subscribe((s) => (this.gameState = s));
    }
}
