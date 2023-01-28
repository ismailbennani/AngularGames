import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PageNotFoundModule} from "./page-not-found/page-not-found.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PageNotFoundModule
  ],
  exports: [CommonModule, PageNotFoundModule]
})
export class SharedModule { }
