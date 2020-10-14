import {NgModule} from '@angular/core';
import {PickDistributionReportModule} from "./PickDistributionReport/PickDistributionReport.module";
import {PickInfoReportModule} from "./PickInfoReport/PickInfoReport.module";
import {Slotinfo_reportModule} from "./slotinfo_report/slotinfo_report.module";


@NgModule({
    imports: [
        PickDistributionReportModule,
        PickInfoReportModule,
        Slotinfo_reportModule
    ]
})
export class ReportsModule {
}
