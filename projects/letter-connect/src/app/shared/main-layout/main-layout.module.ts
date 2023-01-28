import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@NgModule({
    declarations: [MainLayoutComponent],
    exports: [MainLayoutComponent],
    imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule, RouterLink],
})
export class MainLayoutModule {}
