import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrowermasterlistComponent } from './growermasterlist.component';
import {GrowermastercreateModule} from './growermastercreate/growermastercreate.module';
import {RouterModule, Routes} from '@angular/router';
import {PartylistComponent} from '../../partymaster/partylist/partylist.component';
import {AuthGuard} from '../../../../../@pristine/process/AuthGuard';
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

const route: Routes = [{
  path: 'growermasterlist',
  component: GrowermasterlistComponent,
  canActivate:[AuthGuard]
}]

@NgModule({
  declarations: [GrowermasterlistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    GrowermastercreateModule,
    MatDividerModule,
    MatTableModule,
    pristineSharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule
  ]
})
export class GrowermasterlistModule { }
