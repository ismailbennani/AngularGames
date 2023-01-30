import { GameLevelState } from './game-level-state';
import { SeededRandomState } from '../../shared/helpers/random-helpers';

export interface GameState {
    readonly gameSettings: GameSettings;

    readonly worldCount: number;
    readonly worldSettings?: WorldSettings;
    readonly oldWorldSettings: WorldSettings[];

    readonly levelCount?: number;
    readonly currentLevel?: GameLevelState;

    readonly randomStateForNextLevel?: SeededRandomState;
}

export interface GameSettings {
    readonly easyLevelsPerWorld: number;
    readonly normalLevelsPerWorld: number;
    readonly hardLevelsPerWorld: number;
}

export interface WorldSettings {
    readonly randomSeed: string;
}
