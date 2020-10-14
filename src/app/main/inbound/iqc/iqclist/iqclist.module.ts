import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IqclistComponent} from './iqclist.component';
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
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";

const routes: Routes = [
    {
        path: 'iqclist',
        component: IqclistComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [IqclistComponent],
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
        MatRippleModule
    ]
})
export class IqclistModule {
}
