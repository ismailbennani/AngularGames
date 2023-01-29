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

    @Input()
    public size: GameGridSize = 'medium';

    @Input()
    public reveal: boolean = true;

    public getFontSizeInPx(): number {
        switch (this.size) {
            case 'small':
                return 10;
            case 'medium':
                return 20;
            case 'huge':
                return 60;
        }
    }

    public getCellSizeInPx(): number {
        switch (this.size) {
            case 'small':
                return 20;
            case 'medium':
                return 40;
            case 'huge':
                return 120;
        }
    }
}

export type GameGridSize = 'small' | 'medium' | 'huge';
