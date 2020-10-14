import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReshipmentComponent} from './reshipment.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";

const routes: Routes = [
    {
        path: 'reshipment',
        component: ReshipmentComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [ReshipmentComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatButtonModule,
        MatRippleModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatTooltipModule,
    ]
})
export class ReshipmentModule {
}
