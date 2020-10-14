import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VendorlistModule} from "./vendorlist/vendorlist.module";
import {ViewvendorModule} from "./vendorlist/viewvendor/viewvendor.module";
import {CreatevendorModule} from "./vendorlist/createvendor/createvendor.module";
import {VendorcatalogueModule} from "./vendorcatalogue/vendorcatalogue.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        CreatevendorModule,
        VendorlistModule,
        ViewvendorModule,
        VendorcatalogueModule
    ]
})
export class VendormanagementModule {
}
