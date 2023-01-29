import { Bounds, boundsOverlap, Crossword, Word } from './crossword';

export const generateCrossword = (settings: CrosswordGeneratorSettings): Crossword => {
    const normalizedLetters = normalizeWord(''.concat(...settings.letters));
    const validWords = settings.dictionary.filter((w) => canWordBeWrittenUsingLetters(w, normalizedLetters));

    const alreadyTried = new Set<number>();
    const words: Word[] = [];
    const maxTries = 10000;

    let horiz = true;
    let tries = 0;
    while (words.length < settings.maxNumberOfWords && alreadyTried.size < validWords.length && tries < maxTries) {
        const wordIndex = Math.floor(Math.random() * validWords.length);
        if (alreadyTried.has(wordIndex)) {
            continue;
        }

        alreadyTried.add(wordIndex);

        const word = validWords[wordIndex];
        const bounds: Bounds[] = getValidBounds(words, word, horiz);

        if (!bounds.length) {
            continue;
        }

        words.push({ word: validWords[wordIndex], horiz: horiz, bounds: bounds[0] });

        horiz = !horiz;
    }

    if (words.length < settings.minNumberOfWords) {
        throw new Error(`Could not generate enough words (${words.length}/${settings.minNumberOfWords})`);
    }

    return { words, letters: settings.letters };
};

export interface CrosswordGeneratorSettings {
    readonly dictionary: string[];
    readonly letters: string[];
    readonly minNumberOfWords: number;
    readonly maxNumberOfWords: number;
}

export const DEFAULT_CROSSWORD_GENERATOR_SETTINGS: CrosswordGeneratorSettings = {
    dictionary: [],
    letters: [],
    minNumberOfWords: 5,
    maxNumberOfWords: 20,
};

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
    for (let i = 0; i < normalizedLetters.length; i++) {
        if (normalizedLetters[i] && (!normalizedWord[i] || normalizedWord[i] > normalizedLetters[i])) {
            return false;
        }
    }

    return true;
}

function getValidBounds(words: Word[], word: string, horiz: boolean): Bounds[] {
    if (!words.length) {
        return [makeBounds(word, 0, 0, horiz)];
    }

    const result: Bounds[] = [];
    for (const existingWord of words) {
        for (let i = 0; i < existingWord.word.length; i++) {
            for (let j = 0; j < word.length; j++) {
                if (existingWord.word[i] === word[j]) {
                    const xInExistingWord = existingWord.horiz ? existingWord.bounds.x + i : existingWord.bounds.x;
                    const yInExistingWord = existingWord.horiz ? existingWord.bounds.y : existingWord.bounds.y + i;

                    const x = horiz ? xInExistingWord - j : xInExistingWord;
                    const y = horiz ? yInExistingWord : yInExistingWord - j;
                    const bounds = makeBounds(word, x, y, horiz);

                    if (overlap(words, bounds)) {
                        continue;
                    }

                    result.push(bounds);
                }
            }
        }
    }

    return result;
}

function overlap(words: Word[], bounds: Bounds) {
    for (const word of words) {
        if (boundsOverlap(word.bounds, bounds)) {
            return true;
        }
    }

    return false;
}

function makeBounds(word: string, x: number, y: number, horiz: boolean) {
    return { x: x, y: y, width: horiz ? x + word.length : x, height: horiz ? y : y + word.length };
}
