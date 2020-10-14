import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IqcscanningModule} from "./iqcscanning/iqcscanning.module";
import {IqclistModule} from "./iqclist/iqclist.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        IqcscanningModule,
        IqclistModule
    ]
})
export class IqcModule {
}
