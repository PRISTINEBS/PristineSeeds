import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemattributetypeModule} from "./itemattributetype/itemattributetype.module";
import {ItemattributevalueModule} from "./itemattributevalue/itemattributevalue.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ItemattributetypeModule,
        ItemattributevalueModule,

    ]
})
export class ItemattributeModule {
}
