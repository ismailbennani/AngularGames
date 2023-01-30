import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-game',
    templateUrl: './new-game.component.html',
    styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent {
    public seeds: string[] = ['Test 1', 'Test 2', 'Test 3', 'Test 4'];

    constructor(private gameService: GameService, private router: Router) {}

    public play(seed: string) {
        this.gameService.create(seed);
        this.router.navigateByUrl('/game').then();
    }
}
