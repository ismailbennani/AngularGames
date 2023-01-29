import { Component, Input, isDevMode } from '@angular/core';
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
    public reveal: boolean = isDevMode();

    public getFontSizeInPx(): number {
        return this.getCellSizeInPx() / 2;
    }

    public getCellSizeInPx(): number {
        const containerWidth = window.innerWidth * 0.9;
        const containerHeight = window.innerHeight * 0.5;

        return !this.grid
            ? 0
            : Math.min(containerWidth / this.grid.bounds.width, containerHeight / this.grid.bounds.height);
    }
}
