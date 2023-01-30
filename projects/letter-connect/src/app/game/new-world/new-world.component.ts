import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-world',
    templateUrl: './new-world.component.html',
    styleUrls: ['./new-world.component.scss'],
})
export class NewWorldComponent implements OnInit {
    public title: string = '';
    public seeds: string[] = ['Test 1', 'Test 2', 'Test 3', 'Test 4'];

    constructor(private gameService: GameService, private router: Router) {}

    public ngOnInit() {
        let game = this.gameService.get();
        if (!game) {
            game = this.gameService.create();
        }

        this.title = 'World ' + game.worldCount;
    }

    public play(seed: string) {
        this.gameService.createWorld(seed);
        this.router.navigateByUrl('/game').then();
    }
}
