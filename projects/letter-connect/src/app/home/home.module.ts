import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { GameModule } from '../game/game.module';

@NgModule({
    declarations: [HomeComponent],
    imports: [CommonModule, RouterModule, HomeRoutingModule, MatButtonModule, GameModule],
})
export class HomeModule {}
