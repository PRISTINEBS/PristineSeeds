import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PickmanualComponent} from './pickmanual.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [{
    path: 'pickmanual',
    component: PickmanualComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [PickmanualComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
    ]
})
export class PickmanualModule {
}
