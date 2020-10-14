import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RoasterMasterComponent} from "./RoasterMaster.component";
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatExpansionModule} from "@angular/material/expansion";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTableModule} from "@angular/material/table";
import {RoasterMasterService} from "./RoasterMaster.service";
import {MatCardModule} from "@angular/material/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatStepperModule} from "@angular/material/stepper";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatChipsModule} from "@angular/material/chips";
import {MatRippleModule} from "@angular/material/core";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatDividerModule} from "@angular/material/divider";

const routes: Routes = [
    {
        path: 'rostermaster',
        component: RoasterMasterComponent,
        resolve: {rostermaster: RoasterMasterService},
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        RoasterMasterComponent
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
        MatDatepickerModule,
        MatGridListModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatChipsModule,
        MatMenuModule,
        MatToolbarModule,
        MatListModule,
        MatRippleModule,
        MatCheckboxModule,
        DragDropModule,
        MatTableModule,
        MatPaginatorModule
    ],
    entryComponents: [],
    providers: [RoasterMasterService]
})
export class RoasterMasterModule {
}
