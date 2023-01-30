import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { pickAtRandom } from '../../shared/helpers/array-helpers';
import { SeededRandom } from '../../shared/helpers/random-helpers';
import nouns from '../content/nouns';
import { ThemeService } from '../../shared/main-layout/theme/theme.service';

@Component({
    selector: 'app-new-world',
    templateUrl: './new-world.component.html',
    styleUrls: ['./new-world.component.scss'],
})
export class NewWorldComponent implements OnInit {
    public title: string = '';
    public seeds: string[] = ['Random', 'seed'];

    constructor(private gameService: GameService, private themeService: ThemeService, private router: Router) {}

    public ngOnInit() {
        let game = this.gameService.get();
        if (!game) {
            game = this.gameService.create();
        }

        this.title = 'World ' + game.worldCount;

        const words = nouns;
        this.seeds = [];
        for (let i = 0; i < 4; i++) {
            const word = pickAtRandom(SeededRandom.create(), words);
            this.seeds.push(word[0].toUpperCase() + word.substring(1));
        }
    }

    public play(seed: string) {
        this.gameService.createWorld(seed);
        this.router.navigateByUrl('/game').then();
    }
}
