import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PutwayworkComponent} from './putwaywork.component';
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
import {MatInputModule} from "@angular/material/input";
import {UpdateputwayquantityComponent} from "./updateputwayquantity/updateputwayquantity.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PutwaybarcodelistComponent} from "./putwaybarcodelist/putwaybarcodelist.component";

const routes: Routes = [
    {
        path: 'putwaywork',
        component: PutwayworkComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [PutwayworkComponent, UpdateputwayquantityComponent, PutwaybarcodelistComponent],
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
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule
    ]
})
export class PutwayworkModule {
}
