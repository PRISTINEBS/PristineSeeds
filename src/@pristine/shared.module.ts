import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {pristineDirectivesModule} from "./directives/directives";
import {pristinePipesModule} from "./pipes/pipes.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        pristineDirectivesModule,
        pristinePipesModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        pristineDirectivesModule,
        pristinePipesModule
    ],
})
export class pristineSharedModule {
}
