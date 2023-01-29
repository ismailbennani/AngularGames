import { Bounds, boundsOverlap, Crossword, Word } from './crossword';
import { pickAtRandom } from '../../shared/helpers/array-helpers';

export const generateCrossword = (settings: CrosswordGeneratorSettings): Crossword => {
    console.log('Generating crossword with settings...', settings);

    const dictionary = [...settings.dictionary];
    const words: Word[] = [];
    const maxTries = 10000;

    let horiz = true;
    let tries = 0;
    while (dictionary.length > 0 && words.length < settings.maxNumberOfWords && tries < maxTries) {
        const wordIndex = Math.floor(Math.random() * dictionary.length);
        const word = dictionary[wordIndex];
        dictionary.splice(wordIndex, 1);

        const bounds: Bounds[] = getValidBounds(words, word, horiz);

        if (!bounds.length) {
            continue;
        }

        words.push({ word, horiz, bounds: pickAtRandom(bounds) });

        horiz = !horiz;
    }

    const result = { words };

    console.log('Crossword', result);

    return result;
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
    for (let i = 0; i < words.length; i++) {
        const existingWord = words[i];
        if (existingWord.horiz === horiz) {
            continue;
        }

        for (let indexInExistingWord = 0; indexInExistingWord < existingWord.word.length; indexInExistingWord++) {
            for (let indexInWord = 0; indexInWord < word.length; indexInWord++) {
                if (existingWord.word[indexInExistingWord] === word[indexInWord]) {
                    const xInExistingWord = existingWord.horiz
                        ? existingWord.bounds.x + indexInExistingWord
                        : existingWord.bounds.x;
                    const yInExistingWord = existingWord.horiz
                        ? existingWord.bounds.y
                        : existingWord.bounds.y + indexInExistingWord;

                    const x = horiz ? xInExistingWord - indexInWord : xInExistingWord;
                    const y = horiz ? yInExistingWord : yInExistingWord - indexInWord;
                    const bounds = makeBounds(word, x, y, horiz);

                    const boundsToCheck = {
                        x: bounds.x - 1,
                        y: bounds.y - 1,
                        width: bounds.width + 2,
                        height: bounds.height + 2,
                    };

                    if (
                        overlap(
                            words.filter((_, index) => index !== i),
                            boundsToCheck
                        )
                    ) {
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
    if (!words.length) {
        return false;
    }

    for (const word of words) {
        if (boundsOverlap(word.bounds, bounds)) {
            return true;
        }
    }

    return false;
}

function makeBounds(word: string, x: number, y: number, horiz: boolean) {
    return { x: x, y: y, width: horiz ? word.length : 1, height: horiz ? 1 : word.length };
}
