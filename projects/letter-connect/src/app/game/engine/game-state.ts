import { createLevelState, GameLevelState } from './game-level-state';
import { Crossword } from './crossword';

export interface GameState {
    readonly levelCount: number;
    readonly currentLevel: GameLevelState;
}

export const createNewGame = (crossword: Crossword): GameState => ({
    levelCount: 1,
    currentLevel: createLevelState(crossword),
});
