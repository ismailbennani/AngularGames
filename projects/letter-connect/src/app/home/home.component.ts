import { Component, OnInit } from '@angular/core';
import { createGameGrid, discoverWord, GameGrid } from '../game/engine/game-level-state';
import { CrosswordGeneratorSettings, generateCrossword } from '../game/engine/crossword-generator';
import { GameService } from '../game/game.service';
import { Router } from '@angular/router';
import { SeededRandom } from '../shared/helpers/random-helpers';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    public grid: GameGrid | undefined;

    public get canContinue(): boolean {
        return this.gameService.hasSavedGame();
    }

    constructor(private gameService: GameService, private router: Router) {}

    ngOnInit() {
        const settings: CrosswordGeneratorSettings = {
            dictionary: ['LETTER', 'CONNECT'],
            longerWordHoriz: false,
            maxNumberOfWords: 2,
        };

        const crossword = generateCrossword(SeededRandom.create(), settings);
        this.grid = createGameGrid(crossword);

        console.log('Grid', this.grid);

        const letter = crossword.words.find((w) => w.word === 'LETTER');
        if (letter) {
            discoverWord(this.grid, letter);
        }
    }

    public newGame() {
        this.gameService.clear();
        this.continue();
    }

    public continue() {
        this.router.navigate(['game']);
    }
}
