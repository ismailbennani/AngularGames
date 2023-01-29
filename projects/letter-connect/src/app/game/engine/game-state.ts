import { createLevelState, GameLevelSettings, GameLevelState } from './game-level-state';
import { CrosswordGeneratorSettings } from './crossword-generator';

export interface GameState {
    readonly settings: Partial<CrosswordGeneratorSettings> | undefined;
    readonly levelCount: number;
    readonly currentLevel: GameLevelState;
}

export const createNewGame = (settings: GameLevelSettings): GameState => {
    const currentLevel = createLevelState(settings);

    return {
        settings,

        levelCount: 1,
        currentLevel,
    };
};
