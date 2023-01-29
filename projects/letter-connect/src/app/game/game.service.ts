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
    private state: GameState;

    private stateSubject: ReplaySubject<GameState> = new ReplaySubject<GameState>(1);

    public get state$(): Observable<GameState> {
        return this.stateSubject.asObservable();
    }

    constructor() {
        let state: GameState | undefined;

        const stateStr = localStorage.getItem(GameService.LocalStoreKey);
        if (stateStr) {
            state = JSON.parse(stateStr) as GameState;
        }

        this.state = state ?? createNewGame();

        this.notify();
    }

    public attempt(word: string) {
        const result = Engine.attempt(this.state, word);
        this.checkGameOver();
        this.notify();

        return result;
    }

    public hint() {
        Engine.hint(this.state);
        this.checkGameOver();
        this.notify();
    }

    public checkGameOver() {
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
        localStorage.setItem(GameService.LocalStoreKey, JSON.stringify(this.state));
        this.stateSubject.next(this.state);
    }
}
