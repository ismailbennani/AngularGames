import { Component, ElementRef, Input, isDevMode, ViewChild } from '@angular/core';
import { GameGrid } from '../../engine/game-level-state';

@Component({
    selector: 'app-game-grid',
    templateUrl: './game-grid.component.html',
    styleUrls: ['./game-grid.component.scss'],
})
export class GameGridComponent {
    @ViewChild('container')
    private containerElement: ElementRef | undefined;

    @Input()
    public grid: GameGrid | undefined;

    @Input()
    public reveal: boolean = isDevMode();

    public getFontSizeInPx(): number {
        return this.getCellSizeInPx() / 2;
    }

    public getCellSizeInPx(): number {
        const containerWidth = this.containerElement?.nativeElement.offsetWidth ?? 0;
        const containerHeight = this.containerElement?.nativeElement.offsetHeight ?? 0;

        return !this.grid
            ? 0
            : Math.min(containerWidth / this.grid.bounds.width, containerHeight / this.grid.bounds.height);
    }
}
