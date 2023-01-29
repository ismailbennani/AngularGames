import { Bounds, boundsOverlap, Crossword, Word } from './crossword';
import { pickAtRandom, shuffle } from '../../shared/helpers/array-helpers';

export const generateCrossword = (settings: CrosswordGeneratorSettings): Crossword => {
    console.log('Generating crossword with settings...', settings);

    if (!settings.dictionary.length) {
        throw new Error('No words in dictionary');
    }

    const dictionary = [...settings.dictionary];
    const words: Word[] = [];

    // pick first word
    const longestWordSize = dictionary.reduce((acc, w) => (w.length > acc ? w.length : acc), 0);
    const longestWords = dictionary.filter((w) => w.length == longestWordSize);
    const oneOfLongestWords = shuffle(longestWords)[0];
    const bounds = getValidBounds(words, oneOfLongestWords, true);
    words.push({ word: oneOfLongestWords, horiz: true, bounds: pickAtRandom(bounds) });
    removeAllMatches(dictionary, oneOfLongestWords);

    // pick other words
    let horiz = false;
    let tries = 0;
    const maxTries = 1000;
    while (dictionary.length > 0 && words.length < settings.maxNumberOfWords && tries < maxTries) {
        tries++;

        const wordIndex = Math.floor(Math.random() * dictionary.length);
        const word = dictionary[wordIndex];

        const bounds: Bounds[] = getValidBounds(words, word, horiz);

        if (!bounds.length) {
            continue;
        }

        removeAllMatches(dictionary, word);

        words.push({ word, horiz, bounds: pickAtRandom(bounds) });

        horiz = !horiz;
    }

    if (tries >= maxTries) {
        console.log('Could not place all required words');
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

                    if (!canAddWord(words, { word, horiz, bounds })) {
                        continue;
                    }

                    result.push(bounds);
                }
            }
        }
    }

    return result;
}

function canAddWord(words: Word[], word: Word): boolean {
    if (!words.length) {
        return true;
    }

    for (const otherWord of words) {
        const overlap = boundsOverlap(word.bounds, otherWord.bounds);

        if (otherWord.horiz !== word.horiz && overlap) {
            const otherWordIndex = otherWord.horiz
                ? word.bounds.x - otherWord.bounds.x
                : word.bounds.y - otherWord.bounds.y;

            const wordIndex = word.horiz ? otherWord.bounds.x - word.bounds.x : otherWord.bounds.y - word.bounds.y;

            if (otherWord.word[otherWordIndex] !== word.word[wordIndex]) {
                return false;
            }
        } else if (otherWord.horiz === word.horiz && overlap) {
            return false;
        } else {
            const topBounds = {
                x: word.bounds.x,
                y: word.bounds.y - 1,
                width: word.bounds.width,
                height: 1,
            };

            const bottomBounds = {
                x: word.bounds.x,
                y: word.bounds.y + 1,
                width: word.bounds.width,
                height: 1,
            };

            const leftBounds = {
                x: word.bounds.x - 1,
                y: word.bounds.y,
                width: 1,
                height: word.bounds.height,
            };

            const rightBounds = {
                x: word.bounds.x + 1,
                y: word.bounds.y,
                width: 1,
                height: word.bounds.height,
            };

            if (
                boundsOverlap(topBounds, otherWord.bounds) ||
                boundsOverlap(bottomBounds, otherWord.bounds) ||
                boundsOverlap(leftBounds, otherWord.bounds) ||
                boundsOverlap(rightBounds, otherWord.bounds)
            ) {
                return false;
            }
        }
    }

    return true;
}

function makeBounds(word: string, x: number, y: number, horiz: boolean) {
    return { x: x, y: y, width: horiz ? word.length : 1, height: horiz ? 1 : word.length };
}

function removeAllMatches(dictionary: string[], oneOfLongestWords: string) {
    let index;
    do {
        index = dictionary.findIndex((w) => w == oneOfLongestWords);
        dictionary.splice(index, 1);
    } while (index >= 0);
}
