import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BlendinglistModule} from './blendinglist/blendinglist.module';
import {BlendingcreateModule} from './blendingcreate/blendingcreate.module';
import {BlendingviewModule} from './blendingview/blendingview.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BlendinglistModule,
    BlendingcreateModule,
    BlendingviewModule
  ]
})
export class BlendingModule { }
