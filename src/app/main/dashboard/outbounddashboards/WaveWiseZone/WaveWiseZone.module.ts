import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule, Routes} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {NgModule} from "@angular/core";
import {MatStepperModule} from "@angular/material/stepper";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {pristineWidgetModule} from "../../../../../@pristine/components";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatChipsModule} from "@angular/material/chips";
import {WaveWiseZoneComponent} from "./WaveWiseZone.component";
import {MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {WaveWiseZoneService} from "./WaveWiseZone.service";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
    {
        path: 'wavewisezone',
        component: WaveWiseZoneComponent,
        resolve: {
            data: WaveWiseZoneService
        }
    }
];

@NgModule({
    declarations: [
        WaveWiseZoneComponent
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
        WaveWiseZoneService
    ],
    entryComponents: []
})
export class WaveWiseZoneModule {
}

