import {NgModule} from '@angular/core';
import {CreatetransferorderModule} from "./createtransferorder/createtransferorder.module";
import {TransferOrderlistModule} from "./transferorderlist/transferorderlist.module";


@NgModule({
    imports: [
    CreatetransferorderModule,
      TransferOrderlistModule
    ]
})
export class transferorderModule {
}
