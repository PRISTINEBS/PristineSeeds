import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PickInfoReportService} from "./PickInfoReport.service";
import {isArray} from "rxjs/internal-compatibility";
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {PromiseResponse} from "../../../modal/PromiseResponse";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {NgxSpinnerService} from "ngx-spinner";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'PickInfoReport',
    templateUrl: './PickInfoReport.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./PickInfoReport.component.scss']
})

export class PickInfoReportComponent implements OnInit {
    loading: boolean = false;
    displayedColumns: string[] = ['pick_no', 'pick_line_no', 'source_document', 'order_no', 'bincode', 'barcode',
        'qty_ordered', 'qty_picked', 'pick_status', 'tray', 'sorting_zone', 'slot_id', 'consolidation_qty', 'oqc_good_qty',];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatSort, {static: true}) sort: MatSort
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator


    constructor(private validateResponse: ValidateResponse,
                private sessionManageMent: SessionManageMent,
                public _prickInfoReportService: PickInfoReportService,
                private pristineToaster: ToastrService,
                private spinner: NgxSpinnerService,
                private webApiHttp: WebApiHttp) {
    }

    ngOnInit() {
    }

    getPickInfoFromServer(pickNo: string) {
        try {
            this.spinner.show();
            this._prickInfoReportService.getPickInfoFromServer(pickNo).then((result: Array<any> | PromiseResponse) => {
                if (isArray(result)) {
                    if (this.validateResponse.checkArrayResponseCondition(result) == true) {
                        this.dataSource = new MatTableDataSource<any>(result);
                        this.dataSource.sort = this.sort;
                        this.dataSource.paginator = this.paginator;

                    } else {
                        this.pristineToaster.error(result[0].message, "Error");
                    }
                } else {
                    this.pristineToaster.error(result.message, "Error");
                }
                this.spinner.hide();
            });
        } catch (e) {
            this.spinner.hide();
        }
    }

    applyFilter(filterValue: string, keyName: string) {
        this.dataSource.filter = filterValue;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
            if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
                return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
            } else {
                return false
            }

        };
    }
}


