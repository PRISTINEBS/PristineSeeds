import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ProcesstransferlistModule} from "./processtransferlist/processtransferlist.module";
import {ProcesstransfercreateModule} from "./processtransfercreate/processtransfercreate.module";
import {ProcesstransferviewModule} from "./processtransferview/processtransferview.module";
import {GotassignmentModule} from "./gotassignment/gotassignment.module";
import {GotfieldtestsModule} from "./gotfieldtests/gotfieldtests.module";
import {BtelisatestsModule} from "./btelisatests/btelisatests.module";
import {GotfieldtestscompletedModule} from "./gotfieldtestscompleted/gotfieldtestscompleted.module";
import {BtelisatestscompletedModule} from "./btelisatestscompleted/btelisatestscompleted.module";
import {StlgerminationtestModule} from "./stlgerminationtest/stlgerminationtest.module";
import {StlgerminationtestviewModule} from "./stlgerminationtestview/stlgerminationtestview.module";
import {StlphysicalpuritytestModule} from "./stlphysicalpuritytest/stlphysicalpuritytest.module";
import {StlphysicalpuritytestviewModule} from "./stlphysicalpuritytestview/stlphysicalpuritytestview.module";
import {StlmoisturetestModule} from './stlmoisturetest/stlmoisturetest.module';
import {StlmoisturetestviewModule} from './stlmoisturetestview/stlmoisturetestview.module';
import {StlvigourtestModule} from './stlvigourtest/stlvigourtest.module';
import {StlvigourtestviewModule} from './stlvigourtestview/stlvigourtestview.module';
import {QcfinaltestModule} from './qcfinaltest/qcfinaltest.module';
import {QcfinaltestdeclaredModule} from './qcfinaltestdeclared/qcfinaltestdeclared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProcesstransferlistModule,
    ProcesstransfercreateModule,
    ProcesstransferviewModule,
    GotassignmentModule,
    GotfieldtestsModule,
    GotfieldtestscompletedModule,
    BtelisatestsModule,
    BtelisatestscompletedModule,
    StlgerminationtestModule,
    StlgerminationtestviewModule,
    StlphysicalpuritytestModule,
    StlphysicalpuritytestviewModule,
    StlmoisturetestModule,
    StlmoisturetestviewModule,
    StlvigourtestModule,
    StlvigourtestviewModule,
    QcfinaltestModule,
    QcfinaltestdeclaredModule
  ],providers : [DatePipe]
})
export class ProcesstransferModule { }
