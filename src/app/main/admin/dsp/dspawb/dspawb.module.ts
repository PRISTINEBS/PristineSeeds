import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {DsplistModule} from "../dsplist/dsplist.module";
import {DspawbComponent} from "./dspawb.component";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatRippleModule} from "@angular/material/core";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [{
    component: DspawbComponent,
    path: 'dspawb',
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [DspawbComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        pristineSharedModule,
        MatButtonModule,
        MatRippleModule,
        MatTabsModule,
        DsplistModule,
        MatFormFieldModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
        MatTooltipModule,
    ]
})
export class DspawbModule {
}
