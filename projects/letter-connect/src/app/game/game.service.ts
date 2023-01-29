import { Injectable } from '@angular/core';
import { createNewGame, GameState } from './engine/game-state';
import { Observable, ReplaySubject } from 'rxjs';
import { GameLevelSettings } from './engine/game-level-state';

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
        const settings: GameLevelSettings = {
            letters: ['t', 'e', 's', 't'],
        };
        const newGame = createNewGame(settings);

        console.log(newGame);

        this.state = newGame;
        this.notify();
    }

    private notify() {
        this.stateSubject.next(this.state);
    }
}
