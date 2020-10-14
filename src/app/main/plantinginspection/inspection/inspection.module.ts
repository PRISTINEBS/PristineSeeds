import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InspectionlistModule} from './inspectionlist/inspectionlist.module';
import {InspectiontwolistModule} from './inspectiontwolist/inspectiontwolist.module';
import {InspectionthreelistModule} from './inspectionthreelist/inspectionthreelist.module';
import {InspectionfourlistModule} from './inspectionfourlist/inspectionfourlist.module';
import {InspectionqclistModule} from './inspectionqclist/inspectionqclist.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InspectionlistModule,
    InspectiontwolistModule,
    InspectionthreelistModule,
    InspectionfourlistModule,
    InspectionqclistModule,
  ]
})
export class InspectionModule { }
