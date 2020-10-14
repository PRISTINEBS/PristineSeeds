import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QcfinaltestComponent } from './qcfinaltest.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../@pristine/process/AuthGuard';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {pristineSharedModule} from '../../../../@pristine/shared.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';


const routes : Routes = [
  {
    path:'qcfinaltest',
    component: QcfinaltestComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [QcfinaltestComponent],
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
    MatSelectModule,
    MatCheckboxModule,
  ]
})
export class QcfinaltestModule { }
