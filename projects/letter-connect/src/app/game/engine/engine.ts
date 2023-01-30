import { GameState } from './game-state';
import { GameGridCell } from './game-level-state';
import { pickAtRandom } from '../../shared/helpers/array-helpers';
import { SeededRandom } from '../../shared/helpers/random-helpers';

export class Engine {
    public static attempt(gameState: GameState, word: string): AttemptResult {
        if (!gameState.currentLevel) {
            throw new Error('No level found');
        }

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
            this.discoverCell(gameState.currentLevel.grid.cells[gridY][gridX]);
        }

        return atLeastOneLetter ? AttemptResult.Found : AttemptResult.AlreadyFound;
    }

    public static hint(gameState: GameState) {
        if (!gameState.currentLevel) {
            throw new Error('No level found');
        }

        const cells: GameGridCell[] = [];

        for (const cell of gameState.currentLevel.grid.cells.flatMap((line) => line)) {
            if (cell && !cell.discovered) {
                cells.push(cell);
            }
        }

        const randomCell = pickAtRandom(SeededRandom.create(), cells);
        this.discoverCell(randomCell);
    }

    public static checkGameOver(gameState: GameState): GameOverResult {
        if (!gameState.currentLevel) {
            throw new Error('No level found');
        }

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

    private static discoverCell(cell: GameGridCell) {
        (cell as any).discovered = true;
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
