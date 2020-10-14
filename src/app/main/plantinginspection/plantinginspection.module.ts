import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {PlantingModule} from './planting/planting.module';
import {InspectionModule} from './inspection/inspection.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InspectionModule,
    PlantingModule
  ],
  providers : [DatePipe]
})
export class PlantinginspectionModule { }
