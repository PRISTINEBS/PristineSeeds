import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropstagemasterlistComponent } from './cropstagemasterlist.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../../@pristine/process/AuthGuard';
import { CropstagemastercreateComponent } from './cropstagemastercreate/cropstagemastercreate.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {pristineSharedModule} from '../../../../../@pristine/shared.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';

const route : Routes = [{
  path : 'cropstagemasterlist',
  component : CropstagemasterlistComponent,
  canActivate : [AuthGuard]
}]

@NgModule({
  declarations: [CropstagemasterlistComponent, CropstagemastercreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
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
    MatInputModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatCheckboxModule,
  ]
})
export class CropstagemasterlistModule { }
