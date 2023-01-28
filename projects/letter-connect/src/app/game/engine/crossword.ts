export interface Crossword {
    readonly words: Word[];
    readonly letters: string[];
}

export interface Word {
    readonly x: number;
    readonly y: number;
    readonly letters: string;
}
