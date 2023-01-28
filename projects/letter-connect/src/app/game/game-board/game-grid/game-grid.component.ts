import { Component, Input } from '@angular/core';
import { GameGrid } from '../../engine/game-level-state';

@Component({
    selector: 'app-game-grid',
    templateUrl: './game-grid.component.html',
    styleUrls: ['./game-grid.component.scss'],
})
export class GameGridComponent {
    @Input()
    public grid: GameGrid | undefined;
}
