import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {SaleorderlistComponent} from './saleorderlist.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRippleModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [{
    path: 'salesorderlist',
    component: SaleorderlistComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [SaleorderlistComponent],
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
        MatDatepickerModule,
        MatInputModule
    ],
    providers: [DatePipe]
})
export class SaleorderlistModule {
}
