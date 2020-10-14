import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectionlistComponent } from './inspectionlist.component';
import {RouterModule, Routes} from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRippleModule} from '@angular/material/core';
import {AuthGuard} from '../../../../../@pristine/process/AuthGuard';
import {pristineSharedModule} from '../../../../../@pristine/shared.module';
import {InspectioncreateModule} from './inspectioncreate/inspectioncreate.module';
import {Createinspection1Module} from './inspectioncreate/createinspection1/createinspection1.module';

const routes: Routes = [{
  path: 'inspectionlist',
  component: InspectionlistComponent,
  canActivate: [AuthGuard]
}]

@NgModule({
  declarations: [InspectionlistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDividerModule,
    MatTableModule,
    pristineSharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    InspectioncreateModule,
    Createinspection1Module
  ]
})
export class InspectionlistModule { }
