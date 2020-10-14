import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaindashboardModule} from './maindashboard/maindashboard.module';
import {B2bDashboardModule} from "./outbounddashboards/b2bDashboard/b2bDashboard.module";
import {B2cDashboardModule} from "./outbounddashboards/b2cDashboard/b2cDashboard.module";
import {WaveWiseZoneModule} from "./outbounddashboards/WaveWiseZone/WaveWiseZone.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MaindashboardModule,
        B2bDashboardModule,
        B2cDashboardModule,
        WaveWiseZoneModule

    ]
})
export class DashboardModule {
}
