import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShiftMasterModule} from "./ShiftMaster/ShiftMaster.module";
import {RoasterMasterModule} from "./RoasterMaster/RoasterMaster.module";
import {PriorityMasterModule} from "./PriorityMaster/PriorityMaster.module";
import {ForceAssignMentMasterModule} from "./ForceAssignMentMaster/ForceAssignMentMaster.module";
import {TrayMasterModule} from "./TrayMaster/TrayMaster.module";
import {ReprintInvoiceMasterModule} from "./ReprintInvoiceMaster/ReprintInvoiceMaster.module";
import {CageMasterModule} from "./cageMaster/cageMaster.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ShiftMasterModule,
        RoasterMasterModule,
        PriorityMasterModule,
        ForceAssignMentMasterModule,
        TrayMasterModule,
        ReprintInvoiceMasterModule,
        CageMasterModule
    ]
})
export class MasterModule {
}
