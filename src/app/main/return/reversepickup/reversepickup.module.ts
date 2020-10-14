import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReversepickupComponent} from './reversepickup.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";

const routes: Routes = [
    {
        path: 'reversepickup',
        component: ReversepickupComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [ReversepickupComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatButtonModule,
        MatDividerModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatSelectModule,
    ]
})
export class ReversepickupModule {
}
