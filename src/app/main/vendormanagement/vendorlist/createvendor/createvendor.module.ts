import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreatevendorComponent} from "./createvendor.component";
import {RouterModule, Routes} from "@angular/router";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRippleModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatStepperModule} from "@angular/material/stepper";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";

const routes: Routes = [{
    path: 'createvendor',
    component: CreatevendorComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [CreatevendorComponent],
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
        MatStepperModule,
        MatAutocompleteModule
    ]
})
export class CreatevendorModule {
}
