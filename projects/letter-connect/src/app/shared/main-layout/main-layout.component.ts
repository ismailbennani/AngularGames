import { Component, isDevMode } from '@angular/core';
import { GameService } from '../../game/game.service';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
    constructor(private gameService: GameService) {}

    public get canReset() {
        return isDevMode();
    }

    public reset() {
        this.gameService.clear();
        location.replace('/');
    }
}
