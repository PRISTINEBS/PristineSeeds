import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DsplistModule} from "./dsplist/dsplist.module";
import {DspdocketModule} from "./dspdocket/dspdocket.module";
import {DspserviceabilityModule} from "./dsplist/dspserviceability/dspserviceability.module";
import {DspawbModule} from "./dspawb/dspawb.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DsplistModule,
        DspdocketModule,
        DspserviceabilityModule,
        DspawbModule
    ]
})
export class DspModule {
}
