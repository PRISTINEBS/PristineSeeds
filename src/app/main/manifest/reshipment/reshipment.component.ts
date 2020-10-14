import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {NgxSpinnerService} from "ngx-spinner";
import {Reshipmentmodel} from "./reshipmentmodel";

@Component({
    selector: 'app-reshipment',
    templateUrl: './reshipment.component.html',
    styleUrls: ['./reshipment.component.scss']
})
export class ReshipmentComponent implements OnInit {

    displayedColumns: string[] = ['select', 'sales_invoice_no', 'customer_id', 'ship_name', 'old_dsp', 'old_awb', 'pay_type', 'pincode'];

    dataSource: MatTableDataSource<Reshipmentmodel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    selection = new SelectionModel<Reshipmentmodel>(true, []);

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _toster: ToastrService,
                private _encriptDecript: EncriptDecript,
                private spinner: NgxSpinnerService) {

    }

    ngOnInit(): void {
        this.availalbe_old_awb_list();
    }

    availalbe_old_awb_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.AwbList + this.sessionManageMent.getLocationId).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<Reshipmentmodel>(result);
                        this.dataSource.paginator = this.paginator;
                    } else {
                        this._toster.error(result[0].message, 'Error');
                    }
                    this.spinner.hide();
                }
            ).catch(e => {
                this._toster.error(e, 'Error');
                this.spinner.hide();
            })
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }
    }

    change(ctype: string) {
        try {
            if (this.selection.selected.length > 0) {

                this._toster.info('This feature is blocked for demo', 'Info')
                return;
                this.spinner.show();
                const json = {
                    Type: ctype,
                    LocationId: this.sessionManageMent.getLocationId,
                    lines: this.selection.selected
                }

                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.NewDspandAwb, json).then(
                    result => {
                        if (result[0].condition == 'True') {

                        } else {
                            this._toster.error(result[0].message, 'Error');
                        }
                        this.spinner.hide();
                    }
                ).catch(e => {
                    this._toster.error(e, 'Error');
                    this.spinner.hide();
                })
            } else {
                this._toster.warning('Select something before Changing.', 'Warning')
            }


        } catch (e) {
            this._toster.error(e, 'Error');
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
    checkboxLabel(row?: Reshipmentmodel): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

}
