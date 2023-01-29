import { Injectable } from '@angular/core';
import { createNewGame, GameState } from './engine/game-state';
import { Observable, ReplaySubject } from 'rxjs';
import { Engine } from './engine/engine';

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

        this.notify();

        return result;
    }

    public checkGameOver() {
        return Engine.checkGameOver(this.state);
    }

    private notify() {
        this.stateSubject.next(this.state);
        localStorage.setItem(GameService.LocalStoreKey, JSON.stringify(this.state));
    }
}
