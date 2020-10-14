import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProlistComponent} from './prolist.component';
import {RouterModule, Routes} from "@angular/router";
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
import {MatSelectModule} from "@angular/material/select";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";

const routes: Routes = [
    {
        path: 'prolist',
        component: ProlistComponent,
        canActivate: [AuthGuard]
    }
];


@NgModule({
    declarations: [ProlistComponent],
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
        MatSelectModule
    ]
})
export class ProlistModule {
}
