import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConsolidationComponent} from './consolidation.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";

const route: Routes = [
    {
        path: 'consolidation',
        component: ConsolidationComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    declarations: [ConsolidationComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(route)
    ]
})
export class ConsolidationModule {
}
