import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule, Routes} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {CommonModule, DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {FindgrnComponent} from "./findgrn.component";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSortModule} from "@angular/material/sort";
import {NewgrndialogComponent} from "./newgrndialog/newgrndialog.component";
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
    {
        path: 'findgrn',
        component: FindgrnComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    declarations: [FindgrnComponent, NewgrndialogComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
        pristineSharedModule,
        MatDatepickerModule,
        MatButtonModule,
        MatDividerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatRadioModule,
        MatProgressSpinnerModule,
    ],
    providers: [DatePipe]
})
export class FindgrnModule {
}
