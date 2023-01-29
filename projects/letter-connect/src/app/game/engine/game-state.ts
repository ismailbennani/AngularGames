import { createLevelState, GameLevelState } from './game-level-state';
import { CrosswordGeneratorSettings } from './crossword-generator';

export interface GameState {
    readonly settings: Partial<CrosswordGeneratorSettings> | undefined;
    readonly levelCount: number;
    readonly currentLevel: GameLevelState;
}

export const createNewGame = (settings?: Partial<CrosswordGeneratorSettings>): GameState => {
    const currentLevel = createLevelState(settings);

    return {
        settings,

        levelCount: 1,
        currentLevel,
    };
};
