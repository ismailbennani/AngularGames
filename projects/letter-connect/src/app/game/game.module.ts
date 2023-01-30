import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { MainLayoutModule } from '../shared/main-layout/main-layout.module';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameGridComponent } from './game-board/game-grid/game-grid.component';
import { LettersComponent } from './game-board/letters/letters.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewWorldComponent } from './new-world/new-world.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';

@NgModule({
    declarations: [GameComponent, GameBoardComponent, GameGridComponent, LettersComponent, NewWorldComponent],
    imports: [
        CommonModule,
        GameRoutingModule,
        MainLayoutModule,
        MatGridListModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatListModule,
    ],
    exports: [GameBoardComponent, GameGridComponent],
})
export class GameModule {}
