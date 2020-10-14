import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SaleorderlistModule} from "./saleorderlist/saleorderlist.module";
import {CreatesaleorderModule} from "./createsaleorder/createsaleorder.module";
import {SaleorderapprovalModule} from "./saleorderapproval/saleorderapproval.module";
import {SaleorderviewModule} from "./saleorderview/saleorderview.module";
import {SaleinvoiceModule} from "./saleinvoice/saleinvoice.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SaleorderlistModule,
        CreatesaleorderModule,
        SaleorderapprovalModule,
        SaleorderviewModule,
        SaleinvoiceModule
    ]
})
export class SaleorderModule {
}
