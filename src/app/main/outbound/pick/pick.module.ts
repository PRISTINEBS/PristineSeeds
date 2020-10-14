import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PickComponent} from './pick.component';
import {RouterModule, Routes} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {PreviewFileComponent} from "./previewFile/previewFile.component";
import {AutoFocusDirective} from "./auto-focus.directive";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {MatDialogModule} from "@angular/material/dialog";

const routes: Routes = [
    {
        path: 'pick',
        component: PickComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    declarations: [PickComponent, PreviewFileComponent, AutoFocusDirective],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatInputModule,
        pristineSharedModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatRippleModule,
        MatButtonModule,
        MatDialogModule
    ],
    providers: []
})
export class PickModule {
}
