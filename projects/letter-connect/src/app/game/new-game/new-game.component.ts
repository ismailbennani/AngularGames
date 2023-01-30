import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-game',
    templateUrl: './new-game.component.html',
    styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent {
    public seed: string = '';

    constructor(private gameService: GameService, private router: Router) {}

    public play() {
        this.gameService.create(this.seed);
        this.router.navigateByUrl('/game').then();
    }
}
