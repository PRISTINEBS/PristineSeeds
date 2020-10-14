import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {CommonModule} from "@angular/common";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {NgModule} from "@angular/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {MatRippleModule} from "@angular/material/core";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import {MarketingindentlistComponent} from "./marketingindentlist.component";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [{
    path: 'marketingindentlist',
    component: MarketingindentlistComponent,
    canActivate: [AuthGuard]
}]

@NgModule({
    declarations: [MarketingindentlistComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatDividerModule,
        MatTableModule,
        pristineSharedModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatRippleModule
    ]
})
export class MarketingindentlistModule {
}
