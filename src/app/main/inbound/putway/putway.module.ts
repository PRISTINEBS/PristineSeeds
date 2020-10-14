import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PutwaylistModule} from "./putwaylist/putwaylist.module";
import {PutwayworkModule} from "./putwaywork/putwaywork.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        PutwaylistModule,
        PutwayworkModule

    ]
})
export class PutwayModule {
}
