import { Injectable } from '@angular/core';
import { createNewGame, GameState } from './engine/game-state';
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
        let state: GameState | undefined;

        const stateStr = localStorage.getItem(GameService.LocalStoreKey);
        if (stateStr) {
            state = JSON.parse(stateStr) as GameState;
        }

        this.state = state ?? createNewGame();

        this.notify();

        return this.state;
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

    public next(difficulty: GameLevelDifficulty) {
        (this.state as any).levelCount++;
        (this.state as any).currentLevel = createLevelState(difficulty);

        this.notify();
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
}
