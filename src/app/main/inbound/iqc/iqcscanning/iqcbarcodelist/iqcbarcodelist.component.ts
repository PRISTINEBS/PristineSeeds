import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {BarcodeInfo} from "../../../grn/grnmodal";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {NgxSpinnerService} from "ngx-spinner";
import {IQCBarcode} from "../iqcscanningmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
    selector: 'app-iqcbarcodelist',
    templateUrl: './iqcbarcodelist.component.html',
    styleUrls: ['./iqcbarcodelist.component.scss']
})
export class IqcbarcodelistComponent implements OnInit {

    displayedColumns: string[] = ['item_no', 'barcode', 'accepted_qty', 'rejected_qty'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource: MatTableDataSource<BarcodeInfo>;
    total_accepted_qty: number = 0;
    total_rejected_qty: number = 0;

    constructor(private matdialog: MatDialogRef<IQCBarcode>,
                @Inject(MAT_DIALOG_DATA) public data,
                public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _toster: ToastrService,
                private _encriptDecript: EncriptDecript,
                private spinner: NgxSpinnerService,) {
        this.getbarcodes();
    }

    ngOnInit(): void {

    }

    caluclate_sum() {
        for (let i = 0; i < this.dataSource.data.length; i++) {
            this.total_rejected_qty += this.dataSource.data[i]['rejected_qty'];
            this.total_accepted_qty += this.dataSource.data[i]['accepted_qty'];
        }
    }

    send() {
        this.matdialog.close();
    }

    getbarcodes() {
        try {
            this.spinner.show();
            const json = {
                GRNHeaderNo: this.data
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GRNScannedBarcodeInfo, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<BarcodeInfo>(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.caluclate_sum();
                    } else {
                        this._toster.error(result[0].message, 'Error');
                    }
                    this.spinner.hide();
                }
            ).catch(e => {
                this.spinner.hide();
            })
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
