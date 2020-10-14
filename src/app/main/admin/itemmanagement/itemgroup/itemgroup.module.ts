import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemgroupComponent } from './itemgroup.component';
import {RouterModule, Routes} from '@angular/router';
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
import {ItemlistComponent} from '../itemlist/itemlist.component';
import {AuthGuard} from '../../../../../@pristine/process/AuthGuard';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';

const routes: Routes = [{
  path: 'itemgroup',
  component: ItemgroupComponent,
  canActivate: [AuthGuard]
}]

@NgModule({
  declarations: [ItemgroupComponent],
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
    MatDialogModule
  ]
})
export class ItemgroupModule { }
