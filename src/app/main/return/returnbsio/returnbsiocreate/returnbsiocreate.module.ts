import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnbsiocreateComponent } from './returnbsiocreate.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../../@pristine/process/AuthGuard';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {pristineSharedModule} from '../../../../../@pristine/shared.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';

const routes : Routes = [
  {
    path:'returnbsiocreate',
    component: ReturnbsiocreateComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [ReturnbsiocreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    pristineSharedModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule
  ]
})
export class ReturnbsiocreateModule { }
