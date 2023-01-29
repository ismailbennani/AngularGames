import { GameState } from './game-state';

export class Engine {
    public static attempt(gameState: GameState, word: string): AttemptResult {
        const w = gameState.currentLevel.crossword.words.find((w) => w.word == word);
        if (!w) {
            return AttemptResult.NotFound;
        }

        let atLeastOneLetter = false;
        for (let i = 0; i < w.word.length; i++) {
            const x = w.horiz ? w.bounds.x + i : w.bounds.x;
            const y = w.horiz ? w.bounds.y : w.bounds.y + i;
            const gridX = x - gameState.currentLevel.grid.bounds.x;
            const gridY = y - gameState.currentLevel.grid.bounds.y;

            if (!gameState.currentLevel.grid.cells[gridY][gridX]) {
                throw new Error('Internal error');
            }

            atLeastOneLetter ||= !gameState.currentLevel.grid.cells[gridY][gridX]!.discovered;
            gameState.currentLevel.grid.cells[gridY][gridX] = {
                ...gameState.currentLevel.grid.cells[gridY][gridX]!,
                discovered: true,
            };
        }

        return atLeastOneLetter ? AttemptResult.Found : AttemptResult.AlreadyFound;
    }

    public static checkGameOver(gameState: GameState): GameOverResult {
        for (const cell of gameState.currentLevel.grid.cells.flatMap((line) => line)) {
            if (!cell) {
                continue;
            }

            if (!cell.discovered) {
                return GameOverResult.NotOver;
            }
        }

        return GameOverResult.Won;
    }
}

export enum AttemptResult {
    NotFound = 'not-found',
    Found = 'found',
    AlreadyFound = 'already-found',
}

export enum GameOverResult {
    NotOver = 'not-over',
    Won = 'won',
    Lost = 'lost',
}
