import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TraysortingComponent} from './traysorting.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";

const route: Routes = [
    {
        path: 'traysorting',
        component: TraysortingComponent,
        canActivate: [AuthGuard]
    }
]


@NgModule({
    declarations: [TraysortingComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(route),
        MatDividerModule,
        MatIconModule,
        MatInputModule,
        pristineSharedModule
    ]
})
export class TraysortingModule {
}
