import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeliveryorderviewComponent} from './deliveryorderview.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [{
    path: 'deliveryorderview',
    component: DeliveryorderviewComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [DeliveryorderviewComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatTabsModule,
        MatDividerModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatPaginatorModule,
        MatIconModule,
        MatButtonModule,
    ]
})
export class DeliveryorderviewModule {
}
