import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatGridListModule} from '@angular/material/grid-list';
import {PickInfoReportComponent} from "./PickInfoReport.component";
import {PickInfoReportService} from "./PickInfoReport.service";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatRippleModule} from "@angular/material/core";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatStepperModule} from "@angular/material/stepper";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatChipsModule} from "@angular/material/chips";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";

const routes: Routes = [
    {
        path: 'pickInfoReport',
        component: PickInfoReportComponent,
        resolve: {shiftmaster: PickInfoReportService},
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        PickInfoReportComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatSnackBarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatCardModule,
        pristineSharedModule,
        MatDividerModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatGridListModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatChipsModule,
        MatMenuModule,
        MatToolbarModule,
        MatListModule,
        MatRippleModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
    ],
    entryComponents: [],
    providers: [PickInfoReportService]
})
export class PickInfoReportModule {
}
