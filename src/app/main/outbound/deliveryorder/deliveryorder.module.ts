import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreatedeliveryorderModule} from "./createdeliveryorder/createdeliveryorder.module";
import {DeliveryorderlistModule} from "./deliveryorderlist/deliveryorderlist.module";
import {DeliveryorderapprovalModule} from "./deliveryorderapproval/deliveryorderapproval.module";
import {DeliveryorderviewModule} from "./deliveryorderview/deliveryorderview.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        CreatedeliveryorderModule,
        DeliveryorderlistModule,
        DeliveryorderapprovalModule,
        DeliveryorderviewModule
    ]
})
export class DeliveryorderModule {
}
