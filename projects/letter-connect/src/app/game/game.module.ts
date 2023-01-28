import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { MainLayoutModule } from '../shared/main-layout/main-layout.module';
import { GameBoardComponent } from './game-board/game-board.component';
import { CrosswordComponent } from './game-board/crossword/crossword.component';
import { LettersComponent } from './game-board/letters/letters.component';

@NgModule({
    declarations: [GameComponent, GameBoardComponent, CrosswordComponent, LettersComponent],
    imports: [CommonModule, GameRoutingModule, MainLayoutModule],
})
export class GameModule {}
