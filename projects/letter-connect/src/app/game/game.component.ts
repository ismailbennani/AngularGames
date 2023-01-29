import { Component, HostListener, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { GameOverResult } from './engine/engine';
import { GameState } from './engine/game-state';
import { TitleService } from '../shared/main-layout/title/title.service';
import { ThemeService } from '../shared/main-layout/theme/theme.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    public levelOver: boolean = false;
    public won: boolean = false;

    constructor(
        private gameService: GameService,
        private titleService: TitleService,
        private themeService: ThemeService
    ) {}

    ngOnInit(): void {
        const game = this.gameService.getOrCreate();
        this.update(game);
        this.gameService.state$.subscribe((s) => this.update(s));
    }

    public next() {
        if (!this.levelOver) {
            return;
        }

        this.gameService.next();
    }

    private update(state: GameState) {
        this.levelOver = state.currentLevel.gameOver !== GameOverResult.NotOver;
        this.won = state.currentLevel.gameOver === GameOverResult.Won;

        const title = `World ${state.worldCount} - Level ${state.levelCount}`;
        this.titleService.set(title);

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
