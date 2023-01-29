import { Injectable } from '@angular/core';
import { GameState } from './engine/game-state';
import { Observable, ReplaySubject } from 'rxjs';
import { Engine } from './engine/engine';
import { createLevelState, GameLevelDifficulty } from './engine/game-level-state';

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

    public getOrCreate(): GameState {
        const stateStr = localStorage.getItem(GameService.LocalStoreKey);
        if (stateStr) {
            this.state = JSON.parse(stateStr) as GameState;
        } else {
            const currentLevel = createLevelState(GameLevelDifficulty.Easy);

            this.state = {
                settings: {
                    easyLevelsPerWorld: 3,
                    normalLevelsPerWorld: 5,
                    hardLevelsPerWorld: 2,
                },
                worldCount: 1,
                levelCount: 1,
                currentLevel,
            };
        }

        this.notify();

        return this.state;
    }

    public next() {
        if (!this.state) {
            throw new Error('No game found');
        }

        (this.state as any).levelCount++;
        if (
            this.state.levelCount >
            this.state.settings.easyLevelsPerWorld +
                this.state.settings.normalLevelsPerWorld +
                this.state.settings.hardLevelsPerWorld
        ) {
            (this.state as any).worldCount++;
            (this.state as any).levelCount = 1;
        }

        const difficulty = this.getDifficulty(this.state.levelCount);
        (this.state as any).currentLevel = createLevelState(difficulty);

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

        if (levelCount <= this.state.settings.easyLevelsPerWorld) {
            return GameLevelDifficulty.Easy;
        } else if (levelCount <= this.state.settings.easyLevelsPerWorld + this.state.settings.normalLevelsPerWorld) {
            return GameLevelDifficulty.Normal;
        } else {
            return GameLevelDifficulty.Hard;
        }
    }
}
