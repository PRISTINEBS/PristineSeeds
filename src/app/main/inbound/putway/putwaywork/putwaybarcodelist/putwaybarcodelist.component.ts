import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {MatPaginator} from "@angular/material/paginator";
import {BarcodeInfo} from "../../../grn/grnmodal";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {BarcodeLine} from "../putwayworkmodel";

@Component({
    selector: 'app-iqcbarcodelist',
    templateUrl: './putwaybarcodelist.component.html',
    styleUrls: ['./putwaybarcodelist.component.scss']
})
export class PutwaybarcodelistComponent implements OnInit {

    displayedColumns: string[] = ['item_no', 'barcode', 'accepted_qty', 'rejected_qty', 'putway_pending_qty'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource: MatTableDataSource<BarcodeInfo>;
    total_accepted_qty: number = 0;
    total_rejected_qty: number = 0;
    total_putway_qty: number = 0;

    constructor(private matdialog: MatDialogRef<BarcodeLine>,
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
            this.total_putway_qty += this.dataSource.data[i]['putway_pending_qty'];
        }
    }

    send() {
        this.matdialog.close();
    }

    getbarcodes() {
        try {
            this.spinner.show();
            // const json = {
            //     GRNHeaderNo: this.data.GRNHeaderNo,
            //     ItemNo: this.data.ItemNo
            // }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PutwayBarcodeinfo, this.data).then(
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
