import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GateentryModule} from "./gateentry/gateentry.module";
import {GrnModule} from "./grn/grn.module";
import {IqcModule} from "./iqc/iqc.module";
import {PutwayModule} from "./putway/putway.module";
import {ItemadjusmentModule} from './itemadjusment/itemadjusment.module';


@NgModule({
    imports: [
        CommonModule,
        GateentryModule,
        GrnModule,
        IqcModule,
        PutwayModule,
      ItemadjusmentModule

    ]
})
export class InboundModule {
}
