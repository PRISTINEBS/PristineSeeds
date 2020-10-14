import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {IqcscanningComponent} from './iqcscanning.component';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatRadioModule} from "@angular/material/radio";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatRippleModule} from "@angular/material/core";
import {IqcbarcodelistComponent} from './iqcbarcodelist/iqcbarcodelist.component';

const routes: Routes = [
    {
        path: 'iqcscan',
        component: IqcscanningComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    declarations: [IqcscanningComponent, IqcbarcodelistComponent],
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
        MatRadioModule,
        MatProgressSpinnerModule,
        MatRippleModule,
    ],
    providers: [DatePipe]
})
export class IqcscanningModule {
}
