import { Component, isDevMode } from '@angular/core';
import { GameService } from '../../game/game.service';
import { Observable } from 'rxjs';
import { TitleService } from './title/title.service';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
    public get title$(): Observable<string> {
        return this.titleService.title$;
    }

    constructor(private gameService: GameService, private titleService: TitleService) {}

    public get canReset() {
        return isDevMode();
    }

    public reset() {
        this.gameService.clear();
        location.replace('/');
    }
}
