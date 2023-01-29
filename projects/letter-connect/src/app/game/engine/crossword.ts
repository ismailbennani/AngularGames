export interface Crossword {
    readonly words: Word[];
}

export interface Word {
    readonly bounds: Bounds;
    readonly word: string;
    readonly horiz: boolean;
}

export interface Bounds {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export const boundsOverlap = (bounds1: Bounds, bounds2: Bounds): boolean => {
    if (bounds1.width <= 0 || bounds1.height <= 0 || bounds2.width <= 0 || bounds2.height <= 0) {
        return false;
    }

    if (bounds1.x >= bounds2.x + bounds2.width || bounds2.x >= bounds1.x + bounds1.width) {
        return false;
    }

    if (bounds1.y >= bounds2.y + bounds2.height || bounds2.y >= bounds1.y + bounds1.height) {
        return false;
    }

    return true;
};
