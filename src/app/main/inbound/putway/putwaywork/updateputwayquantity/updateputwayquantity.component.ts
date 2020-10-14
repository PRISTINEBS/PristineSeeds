import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {Putwayline} from "../putwayworkmodel";

@Component({
    selector: 'app-updategrnquantity',
    templateUrl: './updateputwayquantity.component.html',
    styleUrls: ['./updateputwayquantity.component.scss']
})
export class UpdateputwayquantityComponent implements OnInit {

    displayedColumns: string[] = ['select', 'position', 'putway_no', 'barcode', 'bincode', 'quantity', 'vendor_lot_no', 'expiry_date'];

    dataSource: MatTableDataSource<Putwayline>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    selection = new SelectionModel<Putwayline>(true, []);

    constructor(private matdialog: MatDialogRef<UpdateputwayquantityComponent>,
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
                PutwayHeaderNo: this.data.PutwayHeaderNo
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PutwayLineinfo, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<Putwayline>(result);
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
        console.log(filterValue, keyName)
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
    checkboxLabel(row?: Putwayline): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    delete_barcode() {

        try {
            if (this.selection.selected.length > 0) {
                this.spinner.show();
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PutwayDeleteLine, this.selection.selected).then(
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
