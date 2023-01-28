import { Crossword } from './crossword';
import { shuffle } from '../../shared/helpers/array-helpers';

export interface GameLevelState {
    readonly crossword: Crossword;
    readonly grid: GameGrid;
    readonly letters: string[];
}

export interface GameGrid {
    readonly width: number;
    readonly height: number;
    readonly cells: GameGridCell[][];
}

export interface GameGridCell {
    readonly letter: string;
    readonly discovered: boolean;
}

export const createLevelState = (crossword: Crossword): GameLevelState => ({
    crossword,
    grid: {
        width: 0,
        height: 0,
        cells: [],
    },
    letters: shuffle(crossword.letters),
});
