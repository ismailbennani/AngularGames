import { Injectable } from '@angular/core';
import { createNewGame, GameState } from './engine/game-state';
import { Observable, ReplaySubject } from 'rxjs';
import { CrosswordGeneratorSettings } from './engine/crossword-generator';

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
        const settings: Partial<CrosswordGeneratorSettings> = {
            dictionary: ['test', 'etst', 'word'],
            letters: ['t', 'e', 's', 't'],
            minNumberOfWords: 2,
        };
        const newGame = createNewGame(settings);
        if (!newGame) {
            throw Error('Could not create game with settings ' + settings);
        }

        this.state = newGame;
        this.notify();
    }

    private notify() {
        this.stateSubject.next(this.state);
    }
}
