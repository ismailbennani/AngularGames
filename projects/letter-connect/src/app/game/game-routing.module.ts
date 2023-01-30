import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game.component';
import { NewGameComponent } from './new-game/new-game.component';

const routes: Routes = [
    {
        path: '',
        component: GameComponent,
    },
    {
        path: 'new',
        component: NewGameComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GameRoutingModule {}
