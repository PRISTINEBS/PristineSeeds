import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomercreateComponent} from './customercreate.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {CutomerenteraddressComponent} from "./cutomerenteraddress/cutomerenteraddress.component";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";


const routes: Routes = [{
    path: 'customercreate',
    component: CustomercreateComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [CustomercreateComponent,CutomerenteraddressComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
    ]
})
export class CustomercreateModule {
}
