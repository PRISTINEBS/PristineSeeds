import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlendingviewComponent } from './blendingview.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../../@pristine/process/AuthGuard';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {pristineSharedModule} from '../../../../../@pristine/shared.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';

const routes: Routes = [{
  path:'blendingview',
  component : BlendingviewComponent,
  canActivate:[AuthGuard]
}]

@NgModule({
  declarations: [BlendingviewComponent],
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
    MatRippleModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatTabsModule
  ]
})
export class BlendingviewModule { }
