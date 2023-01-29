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

export type GameGridCell = GameGridCellWithLetter | undefined;

export interface GameGridCellWithLetter {
    readonly letter: string;
    readonly discovered: boolean;
}

export const createLevelState = (settings?: Partial<CrosswordGeneratorSettings>): GameLevelState => {
    const crossword = generateCrossword({ ...DEFAULT_CROSSWORD_GENERATOR_SETTINGS, ...(settings ?? {}) });
    const grid = initializeGrid(crossword);

    return {
        crossword,
        grid,
        letters: shuffle(crossword.letters),
    };
};

function initializeGrid(crossword: Crossword): GameGrid {
    const minX = crossword.words.reduce((acc, current) => (current.bounds.x < acc ? current.bounds.x : acc), Infinity);
    const maxX = crossword.words.reduce(
        (acc, current) =>
            current.bounds.x + current.bounds.width > acc ? current.bounds.x + current.bounds.width : acc,
        -Infinity
    );
    const minY = crossword.words.reduce((acc, current) => (current.bounds.y < acc ? current.bounds.y : acc), Infinity);
    const maxY = crossword.words.reduce(
        (acc, current) =>
            current.bounds.y + current.bounds.height > acc ? current.bounds.y + current.bounds.height : acc,
        -Infinity
    );

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const cells: GameGridCell[][] = new Array(height);
    for (let i = 0; i < height; i++) {
        cells[i] = new Array<GameGridCell>(width).fill(undefined);
    }

    console.log(crossword.words);
    console.log(cells);

    for (const word of crossword.words) {
        if (word.horiz) {
            for (let i = 0; i < word.word.length; i++) {
                cells[word.bounds.y - minY][word.bounds.x + i - minX] = { letter: word.word[i], discovered: false };
            }
        } else {
            for (let i = 0; i < word.word.length; i++) {
                cells[word.bounds.y + i - minY][word.bounds.x - minX] = { letter: word.word[i], discovered: false };
            }
        }
    }

    return { width, height, cells };
}
