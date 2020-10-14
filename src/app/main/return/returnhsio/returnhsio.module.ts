import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReturnhsiolistModule} from './returnhsiolist/returnhsiolist.module';
import {ReturnhsiocreateModule} from './returnhsiocreate/returnhsiocreate.module';
import {ReturnhsioviewModule} from './returnhsioview/returnhsioview.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReturnhsiolistModule,
    ReturnhsiocreateModule,
    ReturnhsioviewModule,
  ]
})
export class ReturnhsioModule { }
