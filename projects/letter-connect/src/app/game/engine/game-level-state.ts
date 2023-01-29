import { Crossword } from './crossword';
import { shuffle } from '../../shared/helpers/array-helpers';
import { generateCrossword } from './crossword-generator';

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

export interface GameLevelSettings {
    readonly letters: string[];
    readonly maxNumberOfWords?: number;
}

export const createLevelState = (settings: GameLevelSettings): GameLevelState => {
    const normalizedLetters = normalizeWord(''.concat(...settings.letters));
    const validWords = [].filter((w) => canWordBeWrittenUsingLetters(w, normalizedLetters));

    const crossword = generateCrossword({ dictionary: validWords, maxNumberOfWords: settings.maxNumberOfWords ?? 20 });
    const grid = createGameGrid(crossword);

    return {
        crossword,
        grid,
        letters: shuffle(settings.letters),
    };
};

export function createGameGrid(crossword: Crossword): GameGrid {
    if (!crossword.words.length) {
        return { width: 0, height: 0, cells: [] };
    }

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

    const width = maxX - minX;
    const height = maxY - minY;

    const cells: GameGridCell[][] = new Array(height);
    for (let i = 0; i < height; i++) {
        cells[i] = new Array<GameGridCell>(width).fill(undefined);
    }

    for (const word of crossword.words) {
        if (word.horiz) {
            for (let i = 0; i < word.word.length; i++) {
                cells[word.bounds.y - minY][word.bounds.x + i - minX] = {
                    letter: word.word[i],
                    discovered: false,
                };
            }
        } else {
            for (let i = 0; i < word.word.length; i++) {
                cells[word.bounds.y + i - minY][word.bounds.x - minX] = {
                    letter: word.word[i],
                    discovered: false,
                };
            }
        }
    }

    return { width, height, cells };
}

const letters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];

const letterPositions = Object.fromEntries(letters.map((l, i) => [l, i]));

function normalizeWord(...words: string[]): number[] {
    const letterCount = Array(letters.length);

    for (const word of words) {
        for (let i = 0; i < word.length; i++) {
            letterCount[letterPositions[word[i]]] ??= 0;
            letterCount[letterPositions[word[i]]]++;
        }
    }

    return letterCount;
}

function canWordBeWrittenUsingLetters(word: string, normalizedLetters: number[]): boolean {
    const normalizedWord = normalizeWord(word);

    console.log(normalizedLetters);
    console.log(normalizedWord);

    for (let i = 0; i < normalizedLetters.length; i++) {
        if (
            (!normalizedLetters[i] && normalizedWord[i]) ||
            (normalizedLetters[i] && (!normalizedWord[i] || normalizedWord[i] > normalizedLetters[i]))
        ) {
            return false;
        }
    }

    return true;
}
