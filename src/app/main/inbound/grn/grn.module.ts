import {UpdategrnquantityComponent} from "./updategrnquantity/updategrnquantity.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {GrnwithoutscanningModule} from "./grnwithoutscanning/grnwithoutscanning.module";
import {FindgrnModule} from "./findgrn/findgrn.module";
import {MatSelectModule} from "@angular/material/select";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {ReactiveFormsModule} from "@angular/forms";
import {GrnviewandupdateModule} from "./grnviewandupdate/grnviewandupdate.module";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
    declarations: [UpdategrnquantityComponent],
    imports: [
        CommonModule,
        GrnwithoutscanningModule,
        FindgrnModule,
        GrnviewandupdateModule,
        MatIconModule,
        MatDividerModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
        pristineSharedModule,
    ]
})
export class GrnModule {
}
