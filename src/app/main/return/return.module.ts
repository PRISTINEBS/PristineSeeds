import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ManifestreturnModule} from "./manifestreturn/manifestreturn.module";
import {ManifestreturnlistModule} from "./manifestreturnlist/manifestreturnlist.module";
import {ReversepickupModule} from "./reversepickup/reversepickup.module";
import {CrlistModule} from "./crlist/crlist.module";
import {ReturnbsioModule} from './returnbsio/returnbsio.module';
import {ReturnfsioModule} from './returnfsio/returnfsio.module';
import {ReturnhsioModule} from './returnhsio/returnhsio.module';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ManifestreturnModule,
        ManifestreturnlistModule,
        ReversepickupModule,
        CrlistModule,
        ReturnbsioModule,
        ReturnfsioModule,
        ReturnhsioModule,
    ],
  providers: [DatePipe]
})
export class ReturnModule {
}
