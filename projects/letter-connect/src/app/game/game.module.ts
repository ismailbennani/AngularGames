import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { MainLayoutModule } from '../shared/main-layout/main-layout.module';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameGridComponent } from './game-board/game-grid/game-grid.component';
import { LettersComponent } from './game-board/letters/letters.component';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
    declarations: [GameComponent, GameBoardComponent, GameGridComponent, LettersComponent],
    imports: [CommonModule, GameRoutingModule, MainLayoutModule, MatGridListModule],
})
export class GameModule {}
