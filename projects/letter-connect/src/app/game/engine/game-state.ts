import { createLevelState, GameLevelDifficulty, GameLevelState } from './game-level-state';

export interface GameState {
    readonly levelCount: number;
    readonly currentLevel: GameLevelState;
}

export const createNewGame = (): GameState => {
    const currentLevel = createLevelState(GameLevelDifficulty.Hard);

    return {
        levelCount: 1,
        currentLevel,
    };
};
