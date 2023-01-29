import { Component, isDevMode } from '@angular/core';
import { GameService } from '../../game/game.service';
import { Observable } from 'rxjs';
import { TitleService } from './title/title.service';
import { ThemeService } from './theme/theme.service';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
    public get title$(): Observable<string> {
        return this.titleService.title$;
    }

    public get theme$(): Observable<string> {
        return this.themeService.theme$;
    }

    constructor(
        private gameService: GameService,
        private titleService: TitleService,
        private themeService: ThemeService
    ) {}

    public get devMode() {
        return isDevMode();
    }

    public next() {
        this.gameService.next();
    }

    public reset() {
        this.gameService.clear();
        location.reload();
    }
}
