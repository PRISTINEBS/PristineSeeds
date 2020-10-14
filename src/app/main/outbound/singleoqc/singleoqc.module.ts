import {RouterModule, Routes} from "@angular/router";
import {SingleoqcComponent} from "./singleoqc.component";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";

const route: Routes = [
    {
        path: 'oqcsingle',
        component: SingleoqcComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    declarations: [SingleoqcComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(route)
    ]
})
export class SingleoqcModule {
}
