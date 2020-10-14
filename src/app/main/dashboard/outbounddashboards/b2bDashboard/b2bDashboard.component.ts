import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";
import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {pristineAnimations} from "../../../../../@pristine/animations";
import {DashboardDataModel} from "../../../../modal/DashboardDataModel";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";


@Component({
    selector: 'b2bDashboard',
    templateUrl: './b2bDashboard.component.html',
    styleUrls: ['./b2bDashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: pristineAnimations
})
export class B2bDashboardComponent implements OnInit {

    dashboardData: Array<DashboardDataModel> = [];
    dataSource: MatTableDataSource<any>;
    dataColumns: string[] = ['pick_zone', 'total_pick', 'under_distribution', 'total_bin_to_pick', 'total_qty', 'total_picker', 'active_picker', 'running_average'];
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private validateResponse: ValidateResponse,
        public webapiHttp: WebApiHttp,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.BindUserActivity();
    }

    BindUserActivity() {
        this.webapiHttp.Get(this.webapiHttp.ApiURLArray.DashboardData + 'b2b').then(result => {
            if (this.validateResponse.checkArrayResponseCondition(result)) {
                this.dashboardData = result as DashboardDataModel[];
                this.dataSource = new MatTableDataSource<any>(result);
            }
        }, error => {
            console.log(error);
        });
    }

    Convert_Byte_To_bigger(fileSize: number, decimals = 2): string {
        if (fileSize === 0 || isNaN(fileSize) || fileSize == undefined || fileSize == null) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(fileSize) / Math.log(k));
        return parseFloat((fileSize / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
}

