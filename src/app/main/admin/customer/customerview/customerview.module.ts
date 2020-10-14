import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerviewComponent} from './customerview.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatDividerModule} from "@angular/material/divider";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";

const routes: Routes = [{
    path: 'customerview',
    component: CustomerviewComponent,
    canActivate: [AuthGuard]
}]


@NgModule({
    declarations: [CustomerviewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    FlexModule,
    pristineSharedModule,

  ]
})
export class CustomerviewModule {
}
