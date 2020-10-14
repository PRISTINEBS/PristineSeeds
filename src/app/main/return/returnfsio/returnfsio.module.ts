import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReturnfsiolistModule} from './returnfsiolist/returnfsiolist.module';
import {ReturnfsiocreateModule} from './returnfsiocreate/returnfsiocreate.module';
import {ReturnfsioviewModule} from './returnfsioview/returnfsioview.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReturnfsiolistModule,
    ReturnfsiocreateModule,
    ReturnfsioviewModule
  ]
})
export class ReturnfsioModule { }
