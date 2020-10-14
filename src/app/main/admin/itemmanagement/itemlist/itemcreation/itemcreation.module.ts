import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {AuthGuard} from "../../../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../../../@pristine/shared.module";
import {ItemcreationComponent} from "./itemcreation.component";
import {ItemcreationService} from "./itemcreation.service";
import {itemgroupcreationComponent} from "./itemgroupcreation/itemgroupcreation.component";
import {MatDialogModule} from "@angular/material/dialog";

const routes: Routes = [{
    path: 'itemcreation',
    component: ItemcreationComponent,
    resolve: {itemCreation: ItemcreationService},
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [ItemcreationComponent,itemgroupcreationComponent],
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
    MatAutocompleteModule,
    MatDialogModule
  ]
})
export class ItemcreationModule {
}
