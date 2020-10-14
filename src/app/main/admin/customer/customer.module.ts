import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {CustomerviewModule} from "./customerview/customerview.module";
import {CustomerlistModule} from "./customerlist/customerlist.module";
import {CustomercreateModule} from "./customercreate/customercreate.module";
import {SalepricecreateModule} from "./salepricecreate/salepricecreate.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        CustomerviewModule,
        CustomerlistModule,
        CustomercreateModule,
        SalepricecreateModule
    ],
  providers:[DatePipe]
})
export class CustomerModule {
}
