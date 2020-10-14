import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {BarcodeInfo} from "../grnmodal";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
    selector: 'app-updategrnquantity',
    templateUrl: './updategrnquantity.component.html',
    styleUrls: ['./updategrnquantity.component.scss']
})
export class UpdategrnquantityComponent implements OnInit {

    displayedColumns: string[] = ['select', 'position', 'barcode', 'accepted_qty', 'barcode_batch_id'];

    dataSource: MatTableDataSource<BarcodeInfo>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    selection = new SelectionModel<BarcodeInfo>(true, []);

    constructor(private matdialog: MatDialogRef<UpdategrnquantityComponent>,
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


    send() {
        this.matdialog.close();
    }

    getbarcodes() {
        try {
            this.spinner.show();
            const json = {
                GRNHeaderNo: this.data.grn_no,
                DocumentLineNo: this.data.document_line_no
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.BarcodeInByPOLineInfo, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<BarcodeInfo>(result);
                        this.dataSource.paginator = this.paginator;
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


    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource?.data?.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource?.data?.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: BarcodeInfo): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    delete_barcode() {

        try {
            if (this.selection.selected.length > 0) {
                this.spinner.show();
                const json = {
                    GRNHeaderNo: this.data.grn_no,
                    DocumentLineNo: this.data.document_line_no,
                    lines: this.selection.selected
                }

                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DeleteBarcode, json).then(
                    result => {
                        if (result[0].condition == 'True') {
                            this.matdialog.close({Action: "refresh"});
                        } else {
                            this._toster.error(result[0].message, 'Error');
                        }
                    }
                ).catch(e => {
                    this._toster.error(e, 'Error');
                    this.spinner.hide();
                })
            } else {
                this._toster.warning('Select something before deleting.', 'Warning')
            }


        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }
    }
}
