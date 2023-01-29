import { Bounds, Crossword, Word } from './crossword';
import { shuffle } from '../../shared/helpers/array-helpers';
import { generateCrossword } from './crossword-generator';
import dictionaryFr from '../../../assets/dictionary-fr';
import { GameOverResult } from './engine';

export interface GameLevelState {
    readonly difficulty: GameLevelDifficulty;
    readonly settings: GameLevelSettings;
    readonly crossword: Crossword;
    readonly grid: GameGrid;
    readonly letters: string[];
    readonly gameOver: GameOverResult;
}

export interface GameGrid {
    readonly bounds: Bounds;
    readonly cells: GameGridCell[][];
}

export type GameGridCell = GameGridCellWithLetter | undefined;

export interface GameGridCellWithLetter {
    readonly letter: string;
    readonly discovered: boolean;
}

export enum GameLevelDifficulty {
    Easy = 'easy',
    Normal = 'normal',
    Hard = 'hard',
}

interface GameLevelSettings {
    readonly letters: string[];
    readonly maxNumberOfWords?: number;
}

export const createLevelState = (difficulty: GameLevelDifficulty): GameLevelState => {
    console.log('Generating level...');

    let settings: GameLevelSettings | undefined = undefined;
    let validWords: string[] = [];
    let tries = 0;
    let maxTries = 10;
    while (!areValidSettings(settings, validWords) && tries < maxTries) {
        console.log(`Generating settings (${tries + 1}/${maxTries})`);

        settings = getSettings(difficulty);

        const dictionary = getDictionary();
        const normalizedLetters = normalizeWord(''.concat(...settings.letters));
        validWords = dictionary
            .filter((w) => w.length > 2)
            .map((w) => removeDiacritics(w.toUpperCase()))
            .filter((w) => canWordBeWrittenUsingLetters(w, normalizedLetters));

        tries++;
    }

    if (!areValidSettings(settings, validWords)) {
        throw new Error(`Could not generate valid settings after ${maxTries} tries`);
    }

    console.log('Found valid settings', settings);
    console.log('Valid words', validWords);

    const crossword = generateCrossword({ dictionary: validWords, maxNumberOfWords: settings.maxNumberOfWords ?? 20 });

    let letterCounts: number[] = [];
    for (const word of crossword.words) {
        const normalized = normalizeWord(word.word);
        if (!letterCounts.length) {
            letterCounts = normalized;
        } else {
            for (let i = 0; i < letterCounts.length; i++) {
                letterCounts[i] = Math.max(letterCounts[i], normalized[i]);
            }
        }
    }
    const letters = letterCounts.flatMap((count, index) => Array(count).fill(alphabet[index]));

    const grid = createGameGrid(crossword);

    const level: GameLevelState = {
        difficulty,
        settings: settings,
        crossword,
        grid,
        letters: shuffle(letters),
        gameOver: GameOverResult.NotOver,
    };

    console.log('Level', level);

    return level;
};

export function createGameGrid(crossword: Crossword): GameGrid {
    if (!crossword.words.length) {
        return { bounds: { x: 0, y: 0, width: 0, height: 0 }, cells: [] };
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

    return { bounds: { x: minX, y: minY, width, height }, cells };
}

export const discoverWord = (grid: GameGrid, w: Word) => {
    for (let i = 0; i < w.word.length; i++) {
        const x = w.horiz ? w.bounds.x + i : w.bounds.x;
        const y = w.horiz ? w.bounds.y : w.bounds.y + i;
        const gridX = x - grid.bounds.x;
        const gridY = y - grid.bounds.y;

        if (!grid.cells[gridY][gridX]) {
            throw new Error('Internal error');
        }

        grid.cells[gridY][gridX] = {
            ...grid.cells[gridY][gridX]!,
            discovered: true,
        };
    }
};

export const discoverGameGrid = (grid: GameGrid) => {
    for (const cell of grid.cells.flatMap((line) => line)) {
        if (!cell) {
            continue;
        }

        (cell as any).discovered = true;
    }
};

function areValidSettings(
    settings: GameLevelSettings | undefined,
    validWords: string[]
): settings is GameLevelSettings {
    return !!settings && validWords.length >= (settings?.maxNumberOfWords ?? 0);
}

function getSettings(difficulty: GameLevelDifficulty): GameLevelSettings {
    let numberOfLetters: number;
    let maxNumberOfWords: number;
    switch (difficulty) {
        case GameLevelDifficulty.Easy:
            numberOfLetters = 8;
            maxNumberOfWords = 5;
            break;
        case GameLevelDifficulty.Normal:
            numberOfLetters = 8;
            maxNumberOfWords = 10;
            break;
        case GameLevelDifficulty.Hard:
            numberOfLetters = 10;
            maxNumberOfWords = 15;
            break;
    }

    const letters = shuffle(alphabet).slice(0, numberOfLetters);

    return {
        letters,
        maxNumberOfWords,
    };
}

const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];

function normalizeWord(...words: string[]): number[] {
    const letterCount = new Array<number>(alphabet.length).fill(0);

    for (const word of words) {
        for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < alphabet.length; j++) {
                if (word[i] == alphabet[j]) {
                    letterCount[j]++;
                }
            }
        }
    }

    return letterCount;
}

const removeDiacritics = (letter: string) => letter.normalize('NFD').replace(/\p{Diacritic}/gu, '');

function getDictionary(): string[] {
    return dictionaryFr;
}

function canWordBeWrittenUsingLetters(word: string, normalizedLetters: number[]): boolean {
    const normalizedWord = normalizeWord(word);

    for (let i = 0; i < normalizedLetters.length; i++) {
        if (
            (!normalizedLetters[i] && normalizedWord[i]) ||
            (normalizedLetters[i] && normalizedWord[i] > normalizedLetters[i])
        ) {
            return false;
        }
    }

    return true;
}
