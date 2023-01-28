import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game/game.component';
import { MainLayoutModule } from '../shared/main-layout/main-layout.module';

@NgModule({
    declarations: [GameComponent],
    imports: [CommonModule, GameRoutingModule, MainLayoutModule],
})
export class GameModule {}
