import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {UserDetailComponent} from "./UserDetail.component";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {pristineWidgetModule} from "../../../../../@pristine/components";

const routes: Routes = [
    {
        path: 'userdetail',
        component: UserDetailComponent,
    }
];

@NgModule({
    declarations: [
        UserDetailComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        pristineSharedModule,
        pristineWidgetModule,
        MatCardModule,
        MatDividerModule,

    ]
})
export class UserDetailModule {
}

