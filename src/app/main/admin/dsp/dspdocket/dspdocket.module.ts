import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DspdocketComponent} from "./dspdocket.component";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";

const routes: Routes = [{
    path: 'dspdocket',
    component: DspdocketComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [DspdocketComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class DspdocketModule {
}
