import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {pristineSearchBarModule, pristineShortcutsModule} from "../../../../@pristine/components";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {ToolbarComponent} from "./toolbar.component";

@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,

        pristineSharedModule,
        pristineSearchBarModule,
        pristineShortcutsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule
    ],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarModule {
}
