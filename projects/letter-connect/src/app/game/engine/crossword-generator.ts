import { Bounds, boundsOverlap, Crossword, Word } from './crossword';
import { pickAtRandom } from '../../shared/helpers/array-helpers';

export const generateCrossword = (settings: CrosswordGeneratorSettings): Crossword => {
    const alreadyTried = new Set<number>();
    const words: Word[] = [];
    const maxTries = 10000;

    let horiz = true;
    let tries = 0;
    while (
        words.length < settings.maxNumberOfWords &&
        alreadyTried.size < settings.dictionary.length &&
        tries < maxTries
    ) {
        const wordIndex = Math.floor(Math.random() * settings.dictionary.length);
        if (alreadyTried.has(wordIndex)) {
            continue;
        }

        alreadyTried.add(wordIndex);

        const word = settings.dictionary[wordIndex];
        const bounds: Bounds[] = getValidBounds(words, word, horiz);

        if (!bounds.length) {
            continue;
        }

        words.push({ word: settings.dictionary[wordIndex], horiz: horiz, bounds: pickAtRandom(bounds) });

        horiz = !horiz;
    }

    return { words };
};

export interface CrosswordGeneratorSettings {
    readonly dictionary: string[];
    readonly maxNumberOfWords: number;
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
    return { x: x, y: y, width: horiz ? word.length : 0, height: horiz ? 0 : word.length };
}
