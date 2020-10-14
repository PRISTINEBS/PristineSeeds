import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule, Routes} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import {ReactiveFormsModule} from "@angular/forms";
import {GrnwithoutscanningComponent} from "./grnwithoutscanning.component";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
    {
        path: 'grnwithoutscanning',
        component: GrnwithoutscanningComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [GrnwithoutscanningComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
        pristineSharedModule,
        MatDatepickerModule,
        MatButtonModule,
        MatDividerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        NgxSpinnerModule,
    ]
})
export class GrnwithoutscanningModule {
}
