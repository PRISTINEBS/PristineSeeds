import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManifestreturnComponent} from './manifestreturn.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
    {
        path: 'manifestreturn',
        component: ManifestreturnComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [ManifestreturnComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatPaginatorModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        pristineSharedModule,
        MatSelectModule,
        MatInputModule
    ]
})
export class ManifestreturnModule {
}
