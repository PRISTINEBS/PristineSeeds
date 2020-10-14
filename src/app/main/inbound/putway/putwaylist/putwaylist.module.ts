import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {NgModule} from "@angular/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {PutwaylistComponent} from "./putwaylist.component";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatRippleModule} from "@angular/material/core";
import {PutwaycreateComponent} from "./putwaycreate/putwaycreate.component";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
    {
        path: 'putwaylist',
        component: PutwaylistComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [PutwaylistComponent, PutwaycreateComponent],
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
        MatSelectModule
    ]
})
export class PutwaylistModule {
}
