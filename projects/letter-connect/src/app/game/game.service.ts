import { Injectable } from '@angular/core';
import { GameSettings, GameState } from './engine/game-state';
import { Observable, ReplaySubject } from 'rxjs';
import { Engine } from './engine/engine';
import { createLevelState, GameLevelDifficulty } from './engine/game-level-state';
import { SeededRandom } from '../shared/helpers/random-helpers';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private static readonly LocalStoreKey = 'save';
    private state: GameState | undefined;

    private stateSubject: ReplaySubject<GameState> = new ReplaySubject<GameState>(1);

    public get state$(): Observable<GameState> {
        return this.stateSubject.asObservable();
    }

    constructor() {}

    public hasSavedGame(): boolean {
        return !!localStorage.getItem(GameService.LocalStoreKey);
    }

    public get(): GameState | null {
        const stateStr = localStorage.getItem(GameService.LocalStoreKey);
        if (!stateStr) {
            return null;
        }

        this.state = JSON.parse(stateStr) as GameState;

        this.notify();

        return this.state;
    }

    public create(settings?: Partial<GameSettings>): GameState {
        this.state = {
            gameSettings: {
                easyLevelsPerWorld: 3,
                normalLevelsPerWorld: 5,
                hardLevelsPerWorld: 2,
                ...settings,
            },
            worldCount: 0,
            oldWorldSettings: [],
        };

        this.notify();

        return this.state;
    }

    public createWorld(seed: string): GameState {
        if (!this.state) {
            throw new Error('No game found');
        }

        this.state = {
            ...this.state,

            worldCount: this.state.worldCount + 1,
            worldSettings: { randomSeed: seed },

            levelCount: 0,

            randomStateForNextLevel: new SeededRandom(seed).serialize(),
        };

        this.next();

        return this.state;
    }

    public next() {
        if (!this.state) {
            throw new Error('No game found');
        }

        if (!this.state.worldSettings) {
            throw new Error('No world found');
        }

        (this.state as any).levelCount++;
        if (
            (this.state.levelCount ?? 0) >
            this.state.gameSettings.easyLevelsPerWorld +
                this.state.gameSettings.normalLevelsPerWorld +
                this.state.gameSettings.hardLevelsPerWorld
        ) {
            (this.state as any).oldWorldSettings = [this.state.worldSettings, ...this.state.oldWorldSettings];
            (this.state as any).worldSettings = undefined;
        }

        const difficulty = this.getDifficulty(this.state.levelCount ?? 0);
        const random = SeededRandom.deserialize(this.state.randomStateForNextLevel!);
        (this.state as any).currentLevel = createLevelState(random, difficulty);

        (this.state as any).randomStateForNextLevel = random.serialize();

        this.notify();
    }

    public attempt(word: string) {
        if (!this.state) {
            throw new Error('No game found');
        }

        const result = Engine.attempt(this.state, word);
        this.checkGameOver();
        this.notify();

        return result;
    }

    public hint() {
        if (!this.state) {
            throw new Error('No game found');
        }

        Engine.hint(this.state);
        this.checkGameOver();
        this.notify();
    }

    public checkGameOver() {
        if (!this.state) {
            throw new Error('No game found');
        }

        const result = Engine.checkGameOver(this.state);

        (this.state.currentLevel as any).gameOver = result;

        return result;
    }

    public regenerateCurrentLevel(): GameState {
        if (!this.state) {
            throw new Error('No game found');
        }

        if (!this.state.currentLevel) {
            throw new Error('No level found');
        }

        const difficulty = this.state.currentLevel.difficulty;
        const random = SeededRandom.deserialize(this.state.currentLevel.initialRandomState);
        (this.state as any).currentLevel = createLevelState(random, difficulty);

        this.notify();

        return this.state;
    }

    private notify() {
        if (!this.state) {
            throw new Error('No game found');
        }

        localStorage.setItem(GameService.LocalStoreKey, JSON.stringify(this.state));
        this.stateSubject.next(this.state);
    }

    public clear() {
        localStorage.removeItem(GameService.LocalStoreKey);
    }

    private getDifficulty(levelCount: number): GameLevelDifficulty {
        if (!this.state) {
            throw new Error('No game found');
        }

        if (levelCount <= this.state.gameSettings.easyLevelsPerWorld) {
            return GameLevelDifficulty.Easy;
        } else if (
            levelCount <=
            this.state.gameSettings.easyLevelsPerWorld + this.state.gameSettings.normalLevelsPerWorld
        ) {
            return GameLevelDifficulty.Normal;
        } else {
            return GameLevelDifficulty.Hard;
        }
    }
}
