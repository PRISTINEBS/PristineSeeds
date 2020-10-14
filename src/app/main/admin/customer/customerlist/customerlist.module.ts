import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerlistComponent} from './customerlist.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatSortModule} from "@angular/material/sort";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRippleModule} from "@angular/material/core";

const routes: Routes = [{
    path: 'customerlist',
    component: CustomerlistComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [CustomerlistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDividerModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    pristineSharedModule,
    MatTooltipModule,
    MatRippleModule,
  ]
})
export class CustomerlistModule {
}
