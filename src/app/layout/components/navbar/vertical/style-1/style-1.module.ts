import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {pristineSharedModule} from "../../../../../../@pristine/shared.module";
import {NavbarVerticalStyle1Component} from "./style-1.component";
import {pristineNavigationModule} from "../../../../../../@pristine/components";

@NgModule({
    declarations: [
        NavbarVerticalStyle1Component
    ],
    imports: [
        MatButtonModule,
        MatIconModule,

        pristineSharedModule,
        pristineNavigationModule
    ],
    exports: [
        NavbarVerticalStyle1Component
    ]
})
export class NavbarVerticalStyle1Module {
}
