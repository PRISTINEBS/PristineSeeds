import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreatehybridsaleorderModule} from "./hybridsaleorder/createhybridsaleorder.module";
import {HybridsaleorderlistModule} from "./hybridsaleorderlist/hybridsaleorderlist.module";
import {HybridsaleorderviewModule} from "./hybridsaleorderview/hybridsaleorderview.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        CreatehybridsaleorderModule,
        HybridsaleorderlistModule,
        HybridsaleorderviewModule
    ]
})
export class HybridsaleorderModule {
}
