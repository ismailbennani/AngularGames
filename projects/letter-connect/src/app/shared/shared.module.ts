import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundModule } from './page-not-found/page-not-found.module';
import { MainLayoutModule } from './main-layout/main-layout.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, PageNotFoundModule, MainLayoutModule],
    exports: [CommonModule, PageNotFoundModule, MainLayoutModule],
})
export class SharedModule {}
