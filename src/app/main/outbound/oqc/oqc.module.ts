import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OqcComponent} from './oqc.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";

const route: Routes = [
    {
        path: 'oqcmulti',
        component: OqcComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    declarations: [OqcComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(route)
    ]
})
export class OqcModule {
}
