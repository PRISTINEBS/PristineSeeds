import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReturnbsiolistModule} from './returnbsiolist/returnbsiolist.module';
import {ReturnbsiocreateModule} from './returnbsiocreate/returnbsiocreate.module';
import {ReturnbsioviewModule} from './returnbsioview/returnbsioview.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReturnbsiolistModule,
    ReturnbsiocreateModule,
    ReturnbsioviewModule
  ]
})
export class ReturnbsioModule { }
