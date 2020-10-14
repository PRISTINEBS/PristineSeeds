import {DspserviceabilityComponent} from "./dspserviceability.component";
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../../../@pristine/shared.module";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {AuthGuard} from "../../../../../../@pristine/process/AuthGuard";
import {MatRippleModule} from "@angular/material/core";
import {CreatedspserviceabilityComponent} from "./createdspserviceability/createdspserviceability.component";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [{
    path: 'dspserviceability',
    component: DspserviceabilityComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [DspserviceabilityComponent, CreatedspserviceabilityComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatButtonModule,
        MatRippleModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule
    ]
})
export class DspserviceabilityModule {
}
