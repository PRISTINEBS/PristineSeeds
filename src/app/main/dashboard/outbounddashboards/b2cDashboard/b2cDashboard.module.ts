import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule, Routes} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatIconModule} from "@angular/material/icon";
import {NgModule} from "@angular/core";
import {pristineWidgetModule} from "../../../../../@pristine/components";
import {MatRippleModule} from "@angular/material/core";
import {MatMenuModule} from "@angular/material/menu";
import {B2cDashboardComponent} from "./b2cDashboard.component";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
    {
        path: 'b2coutbound',
        component: B2cDashboardComponent
    }
];

@NgModule({
    declarations: [
        B2cDashboardComponent
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
        MatProgressBarModule,
        MatRippleModule
    ]
})
export class B2cDashboardModule {
}

