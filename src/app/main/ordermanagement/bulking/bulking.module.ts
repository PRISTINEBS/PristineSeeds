import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BulkinglistModule} from './bulkinglist/bulkinglist.module';
import {BulkingcreateModule} from './bulkingcreate/bulkingcreate.module';
import {BulkingviewModule} from './bulkingview/bulkingview.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BulkinglistModule,
    BulkingcreateModule,
    BulkingviewModule
  ]
})
export class BulkingModule { }
