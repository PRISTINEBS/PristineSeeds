import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {NgModule} from "@angular/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {Slotinfo_reportService} from "./slotinfo_report.service";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {Slotinfo_reportComponent} from "./slotinfo_report.component";
import {AllSlotDataDialogComponent} from "./AllSlotData/AllSlotData.component";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {SlotOrderDataDataDialogComponent} from "./SlotOrderDataData/SlotOrderDataData.component";
import {MatStepperModule} from "@angular/material/stepper";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {pristineWidgetModule} from "../../../../@pristine/components";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";

const routes: Routes = [
    {
        path: 'slotinfo_report',
        component: Slotinfo_reportComponent,
        resolve: {
            data: Slotinfo_reportService
        }
    }
];

@NgModule({
    declarations: [
        Slotinfo_reportComponent,
        AllSlotDataDialogComponent,
        SlotOrderDataDataDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        pristineSharedModule,
        pristineWidgetModule,
        MatCardModule,
        MatDividerModule,
        MatStepperModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
    providers: [
        Slotinfo_reportService
    ],
    entryComponents: [AllSlotDataDialogComponent, SlotOrderDataDataDialogComponent]
})
export class Slotinfo_reportModule {
}

