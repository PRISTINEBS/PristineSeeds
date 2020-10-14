import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlantinglistModule} from './plantinglist/plantinglist.module';
import {PlantingviewModule} from './plantingview/plantingview.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlantinglistModule,
    PlantingviewModule
  ]
})
export class PlantingModule { }
