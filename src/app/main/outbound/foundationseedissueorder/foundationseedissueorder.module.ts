import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreatefoundationseedissueorderModule} from "./createfoundationseedissueorder/createfoundationseedissueorder.module";
import {FoundationseedissueorderlistModule} from './foundationseedissueorderlist/foundationseedissueorderlist.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
      CreatefoundationseedissueorderModule,
      FoundationseedissueorderlistModule
    ]
})
export class foundationseedissueorderModule {
}
