import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TlseedarrivalcreateModule} from './tlseedarrivalcreate/tlseedarrivalcreate.module';
import {TlseedarrivallistModule} from './tlseedarrivallist/tlseedarrivallist.module';
import {TlseedarrivalapprovalModule} from './tlseedarrivalapproval/tlseedarrivalapproval.module';
import {TlseedarrivalviewModule} from './tlseedarrivalview/tlseedarrivalview.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TlseedarrivallistModule,
    TlseedarrivalcreateModule,
    TlseedarrivalapprovalModule,
    TlseedarrivalviewModule
  ]
})
export class TlseedarrivalModule { }
