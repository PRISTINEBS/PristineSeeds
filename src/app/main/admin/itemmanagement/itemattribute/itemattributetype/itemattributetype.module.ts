import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../../../@pristine/process/AuthGuard";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {pristineSharedModule} from "../../../../../../@pristine/shared.module";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRippleModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTooltipModule} from "@angular/material/tooltip";
import {itemattributetypeComponent} from "./itemattributetype.component";
import {itemattributetypecreationComponent} from "./itemattributetypecreation/itemattributetypecreation.component";
import {ItemattributetypeService} from "./itemattributetype.service";

const routes: Routes = [{
    path: 'itemattribute',
    component: itemattributetypeComponent,
    resolve: {itemattribute: ItemattributetypeService},
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [itemattributetypeComponent, itemattributetypecreationComponent],
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
        MatDialogModule,
        MatAutocompleteModule,
        MatTooltipModule
    ],
    entryComponents: [itemattributetypecreationComponent]
})
export class ItemattributetypeModule {
}
