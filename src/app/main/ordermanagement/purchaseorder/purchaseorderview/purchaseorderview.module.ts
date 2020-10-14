import {MatFormFieldModule} from "@angular/material/form-field";
import {PurchaseorderviewComponent} from "./purchaseorderview.component";
import {RouterModule, Routes} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRippleModule} from "@angular/material/core";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PurchasegrnbarcodeComponent} from "./purchasegrnbarcode/purchasegrnbarcode.component";
import {PurchasependinggrnquantityComponent} from "./purchasependinggrnqunatity/purchasependinggrnquantity.component";
import {MatDividerModule} from "@angular/material/divider";
import {MatTabsModule} from "@angular/material/tabs";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [{
    path: 'purchaseorderview',
    component: PurchaseorderviewComponent,
    canActivate: [AuthGuard]
}]


@NgModule({
    declarations: [PurchaseorderviewComponent, PurchasegrnbarcodeComponent ,PurchasependinggrnquantityComponent ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatIconModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
        pristineSharedModule,
        MatDatepickerModule,
        MatButtonModule,
        MatRippleModule,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatSortModule,
        MatTabsModule
    ]
})

export class PurchaseorderviewModule {
}
