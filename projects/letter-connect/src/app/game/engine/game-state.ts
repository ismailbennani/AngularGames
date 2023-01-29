import { GameLevelState } from './game-level-state';

export interface GameState {
    readonly settings: GameSettings;
    readonly worldCount: number;
    readonly levelCount: number;
    readonly currentLevel: GameLevelState;
}

export interface GameSettings {
    readonly easyLevelsPerWorld: number;
    readonly normalLevelsPerWorld: number;
    readonly hardLevelsPerWorld: number;
}
