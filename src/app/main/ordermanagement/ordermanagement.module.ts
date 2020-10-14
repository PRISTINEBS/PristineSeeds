import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SaleorderModule} from "./saleorder/saleorder.module";
import {PurchaseorderModule} from "./purchaseorder/purchaseorder.module";
import {TransferModule} from "./transfer/transfer.module";
import {PurchasereturnorderModule} from "./purchasereturnorder/purchasereturnorder.module";
import {ReturngatepassModule} from "./returngatepass/returngatepass.module";
import {TlseedarrivalModule} from './tlseedarrival/tlseedarrival.module';
import {BlendingModule} from './blending/blending.module';
import {BulkingModule} from './bulking/bulking.module';


@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      SaleorderModule,
      PurchaseorderModule,
      TransferModule,
      PurchasereturnorderModule,
      ReturngatepassModule,
      TlseedarrivalModule,
      BlendingModule,
      BulkingModule
    ]
})
export class OrdermanagementModule {
}
