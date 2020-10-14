import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManifestreturnlistComponent} from './manifestreturnlist.component';
import {CreatereturnComponent} from './createreturn/createreturn.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";

const routes: Routes = [
    {
        path: 'manifestreturnlist',
        component: ManifestreturnlistComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [ManifestreturnlistComponent, CreatereturnComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatButtonModule,
        MatDividerModule,
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDialogModule
    ]
})
export class ManifestreturnlistModule {
}
