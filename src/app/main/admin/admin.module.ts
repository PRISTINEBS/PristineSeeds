import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemmanagementModule} from "./itemmanagement/itemmanagement.module";
import {BinmanagementModule} from "./binmanagement/binmanagement.module";
import {DspModule} from "./dsp/dsp.module";
import {BarcodelistModule} from "./barcodelist/barcodelist.module";
import {PartymasterModule} from "./partymaster/partymaster.module";
import {PartycreationModule} from "./partymaster/partylist/partycreation/partycreation.module";
import {SamplecodemasterModule} from "./samplecodemaster/samplecodemaster.module";
import {CustomerModule} from "./customer/customer.module";
import {InventoryModule} from './inventory/inventory.module';
import {ItemledgerentryModule} from './itemledgerentry/itemledgerentry.module';
import {CropstagemasterModule} from './cropstagemaster/cropstagemaster.module';
import {VarietyqualityparameterModule} from './varietyqualityparameter/varietyqualityparameter.module';
import {ParentseedmasterModule} from './parentseedmaster/parentseedmaster.module';
import {GrowermasterModule} from './growermaster/growermaster.module';


@NgModule({
    declarations: [],
  imports: [
    CommonModule,
    ItemmanagementModule,
    BinmanagementModule,
    DspModule,
    BarcodelistModule,
    PartymasterModule,
    PartycreationModule,
    SamplecodemasterModule,
    CustomerModule,
    InventoryModule,
    ItemledgerentryModule,
    CropstagemasterModule,
    VarietyqualityparameterModule,
    ParentseedmasterModule,
    GrowermasterModule,
  ]
})
export class AdminModule {
}
