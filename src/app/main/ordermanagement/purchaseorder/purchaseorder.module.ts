import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PurchaseordercreateModule} from "./purchaseordercreate/purchaseordercreate.module";
import {PurchaseorderlistModule} from "./purchaseorderlist/purchaseorderlist.module";
import {PurchaseorderupdateModule} from "./purchaseorderupdate/purchaseorderupdate.module";
import {PurchaseorderviewModule} from "./purchaseorderview/purchaseorderview.module";
import {PurchaseorderapprovalModule} from "./purchaseorderapproval/purchaseorderapproval.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        PurchaseordercreateModule,
        PurchaseorderlistModule,
        PurchaseorderupdateModule,
        PurchaseorderviewModule,
        PurchaseorderapprovalModule

    ]
})
export class PurchaseorderModule {
}
