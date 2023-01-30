import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game.component';
import { NewWorldComponent } from './new-world/new-world.component';

const routes: Routes = [
    {
        path: '',
        component: GameComponent,
    },
    {
        path: 'new',
        component: NewWorldComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GameRoutingModule {}
