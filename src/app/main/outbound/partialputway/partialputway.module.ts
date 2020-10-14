import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PartialputwayComponent} from './partialputway.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";

const route: Routes = [
    {
        path: 'partialoqcput',
        component: PartialputwayComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    declarations: [PartialputwayComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(route)
    ]
})
export class PartialputwayModule {
}
