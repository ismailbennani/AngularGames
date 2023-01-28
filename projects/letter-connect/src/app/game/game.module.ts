import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { MainLayoutModule } from '../shared/main-layout/main-layout.module';
import { GameBoardComponent } from './game-board/game-board.component';

@NgModule({
    declarations: [GameComponent, GameBoardComponent],
    imports: [CommonModule, GameRoutingModule, MainLayoutModule],
})
export class GameModule {}
