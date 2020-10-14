import {PicklistComponent} from "./picklist.component";
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [{
    path: 'picklist',
    component: PicklistComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [PicklistComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatDividerModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatSelectModule
    ]
})
export class PicklistModule {
}
