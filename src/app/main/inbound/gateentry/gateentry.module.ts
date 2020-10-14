import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreategateentryModule} from './creategateentry/creategateentry.module';
import {GateentryinfoandupdateModule} from './gateentryinfoandupdate/gateentryinfoandupdate.module';
import {GateentrylistModule} from './gateentrylist/gateentrylist.module';

@NgModule({
    imports: [
        CommonModule,
        CreategateentryModule,
        GateentryinfoandupdateModule,
        GateentrylistModule
    ]
})
export class GateentryModule {
}
