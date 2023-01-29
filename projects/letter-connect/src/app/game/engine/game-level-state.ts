import { Crossword } from './crossword';
import { shuffle } from '../../shared/helpers/array-helpers';
import {
    CrosswordGeneratorSettings,
    DEFAULT_CROSSWORD_GENERATOR_SETTINGS,
    generateCrossword,
} from './crossword-generator';

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

export const createLevelState = (settings?: Partial<CrosswordGeneratorSettings>): GameLevelState => {
    const crossword = generateCrossword({ ...DEFAULT_CROSSWORD_GENERATOR_SETTINGS, ...(settings ?? {}) });

    return {
        crossword,
        grid: {
            width: 0,
            height: 0,
            cells: [],
        },
        letters: shuffle(crossword.letters),
    };
};
