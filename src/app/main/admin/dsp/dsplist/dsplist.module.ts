import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatRippleModule} from "@angular/material/core";
import {CreatedspComponent} from "./createdsp/createdsp.component";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {DsplistComponent} from "./dsplist.component";

const routes: Routes = [{
    path: 'dsplist',
    component: DsplistComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [DsplistComponent, CreatedspComponent],
    exports: [
        DsplistComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatPaginatorModule,
        MatDividerModule,
        MatTableModule,
        MatButtonModule,
        MatSortModule,
        MatRippleModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        MatSelectModule,
        MatTooltipModule,
    ]
})
export class DsplistModule {
}
