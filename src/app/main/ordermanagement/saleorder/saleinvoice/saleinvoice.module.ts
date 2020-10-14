import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SaleinvoiceComponent} from './saleinvoice.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatSortModule} from "@angular/material/sort";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [{
    path: 'saleinvoiceview',
    component: SaleinvoiceComponent,
    canActivate: [AuthGuard]
}]


@NgModule({
    declarations: [SaleinvoiceComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatPaginatorModule,
        MatDividerModule,
        MatTableModule,
        MatInputModule,
        MatSortModule,
        pristineSharedModule,
        MatButtonModule,
    ]
})
export class SaleinvoiceModule {
}
