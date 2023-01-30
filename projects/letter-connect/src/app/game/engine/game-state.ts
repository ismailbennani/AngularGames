import { GameLevelState } from './game-level-state';
import { SeededRandomState } from '../../shared/helpers/random-helpers';

export interface GameState {
    readonly settings: GameSettings;
    readonly worldCount: number;
    readonly levelCount: number;
    readonly currentLevel: GameLevelState;
}

export interface GameSettings {
    readonly randomSeed: string;
    readonly randomState: SeededRandomState;

    readonly easyLevelsPerWorld: number;
    readonly normalLevelsPerWorld: number;
    readonly hardLevelsPerWorld: number;
}
