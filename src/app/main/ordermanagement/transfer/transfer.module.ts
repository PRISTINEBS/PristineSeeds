import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransferlistModule} from "./transferlist/transferlist.module";
import {TransfercreateModule} from "./transfercreate/transfercreate.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        TransferlistModule,
        TransfercreateModule
    ]
})
export class TransferModule {
}
