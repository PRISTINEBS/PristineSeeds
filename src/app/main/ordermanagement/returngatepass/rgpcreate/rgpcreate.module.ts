import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RgpcreateComponent} from './rgpcreate.component';
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatSortModule} from "@angular/material/sort";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";


const routes: Routes = [
    {
        path: 'rgpcreate',
        component: RgpcreateComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [RgpcreateComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        MatDividerModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
    ]
})
export class RgpcreateModule {
}
