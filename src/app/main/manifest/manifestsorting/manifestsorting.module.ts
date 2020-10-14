import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManifestsortingComponent} from './manifestsorting.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";

const routes: Routes = [
    {
        path: 'manifestsorting',
        component: ManifestsortingComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [ManifestsortingComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
    ]
})
export class ManifestsortingModule {
}
