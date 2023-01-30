import { Component, HostListener, isDevMode, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { GameOverResult } from './engine/engine';
import { GameState } from './engine/game-state';
import { TitleService } from '../shared/main-layout/title/title.service';
import { ThemeService } from '../shared/main-layout/theme/theme.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    public levelOver: boolean = false;
    public won: boolean = false;

    public title: string = '';

    constructor(
        private gameService: GameService,
        private titleService: TitleService,
        private themeService: ThemeService,
        private router: Router
    ) {}

    ngOnInit(): void {
        let game = this.gameService.get();

        if (game && isDevMode()) {
            game = this.gameService.regenerateCurrentLevel();
        }

        this.update(game);
        this.gameService.state$.subscribe((s) => this.update(s));
    }

    public next() {
        if (!this.levelOver) {
            return;
        }

        this.gameService.next();
    }

    private update(state: GameState | null) {
        if (!state || !state.worldSettings || !state.currentLevel) {
            this.router.navigateByUrl('/game/new').then();
            return;
        }

        this.levelOver = state.currentLevel.gameOver !== GameOverResult.NotOver;
        this.won = state.currentLevel.gameOver === GameOverResult.Won;

        this.title = `World ${state.worldCount} - Level ${state.levelCount}`;

        const themes = this.themeService.getThemes();
        const theme = themes[(state.worldCount - 1) % themes.length];
        this.themeService.set(theme);
    }

    @HostListener('window:keyup.enter', ['$event'])
    private enterPressed(event: KeyboardEvent) {
        if (!this.levelOver) {
            return;
        }

        this.next();

        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}
