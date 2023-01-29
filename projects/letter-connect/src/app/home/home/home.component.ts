import { Component, OnInit } from '@angular/core';
import { createGameGrid, discoverWord, GameGrid } from '../../game/engine/game-level-state';
import { CrosswordGeneratorSettings, generateCrossword } from '../../game/engine/crossword-generator';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    public grid: GameGrid | undefined;

    ngOnInit() {
        const settings: CrosswordGeneratorSettings = {
            dictionary: ['LETTER', 'CONNECT'],
            maxNumberOfWords: 2,
        };

        const crossword = generateCrossword(settings);
        this.grid = createGameGrid(crossword);

        const letter = crossword.words.find((w) => w.word === 'LETTER');
        if (letter) {
            discoverWord(this.grid, letter);
        }
    }
}
