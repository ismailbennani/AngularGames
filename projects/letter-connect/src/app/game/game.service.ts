import { Injectable } from '@angular/core';
import { createNewGame, GameState } from './engine/game-state';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private state: GameState;

    private stateSubject: ReplaySubject<GameState> = new ReplaySubject<GameState>(1);

    public get state$(): Observable<GameState> {
        return this.stateSubject.asObservable();
    }

    constructor() {
        this.state = createNewGame();
        this.notify();
    }

    private notify() {
        this.stateSubject.next(this.state);
    }
}
