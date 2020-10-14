import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Login2Service} from "./login-2.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {Login2Component} from "./login-2.component";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";

const routes = [
    {
        path: 'auth/login-2',
        component: Login2Component,
        resolve: {
            login: Login2Service
        }
    }
];

@NgModule({
    declarations: [
        Login2Component
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        pristineSharedModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    providers: [
        Login2Service
    ]
})
export class Login2Module {
}
