import {Component, OnInit, ViewChild} from '@angular/core';
import {headers, Saleinvoicemodel} from "../../ordermanagement/saleorder/saleinvoice/saleinvoicemodel";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {SelectionModel} from "@angular/cdk/collections";
import {isArray} from "rxjs/internal-compatibility";

@Component({
    selector: 'app-reversepickup',
    templateUrl: './reversepickup.component.html',
    styleUrls: ['./reversepickup.component.scss']
})
export class ReversepickupComponent implements OnInit {

    order: Saleinvoicemodel
    sales_invoice_no: string;
    displayedColumns: string[] = ['select', 'item_no', 'item_desc', 'barcode_no', 'quantity', 'amount', 'discount_amount', 'gst_amount', 'grand_total', 'order_status'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    selection = new SelectionModel<headers>(true, []);
    returnAction: any[] = ['Reship then return', 'Return then reship', 'Reship and no return', 'Return only'];
    returnselected = new FormControl('', [Validators.required]);

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService) {
        this.sales_invoice_no = this.route.snapshot.paramMap.get('response')
    }

    ngOnInit(): void {
        this.get_sale_invoice_info();
    }

    get_sale_invoice_info() {
        try {
            this.spinner.show();
            const json = {
                SaleInvoiceNo: this.sales_invoice_no,
                LocationId: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.SaleInvoiceInfo, json).then(result => {
                if (isArray(result) && result[0].condition == 'False') {
                    this._toster.error(result[0].message, 'Error')
                } else if (result.sales[0].condition == 'True') {
                    this.order = result;
                    this.dataSource = new MatTableDataSource<any>(result.sales);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                } else {
                    this._toster.info(result[0].message, 'Info')
                }
                this.spinner.hide();
            }).catch(error => {
                this._toster.error(error, 'Error')
                this.spinner.hide();
            })
        } catch (e) {
            this._toster.error(e, 'Error')
            this.spinner.show();
        }
    }

    createcr() {
        try {
            this.spinner.show();
            const json = {
                Type: this.returnselected.value,
                LocationId: this.sessionManageMent.getLocationId,
                ParentOrderNo: this.order.sales[0].sales_order_no,
                ParentInvoiceNo: this.sales_invoice_no,
                lines: this.selection.selected
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateCR, json).then(result => {
                if (result[0].condition == 'True') {
                    this._toster.success(result[0].message, 'Success');
                    this.selection.clear();
                    this.get_sale_invoice_info();
                } else {
                    this._toster.error(result[0].message, 'Error');
                }
                this.spinner.hide();
            }).catch(error => {
                this._toster.error(error, 'Error')
                this.spinner.hide();
            })
        } catch (e) {
            this._toster.error(e, 'Error')
            this.spinner.show();
        }
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
            this.dataSource?.data?.forEach((row) => {
                row.order_status == 'Handover Done' ? this.selection.select(row) : []
            });
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: headers): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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

    sum_footer(items: Array<any>, attr: string): number {
        let sum_total: number = 0
        for (let i = 0; i < items.length; i++) {
            sum_total += items[i][attr]
        }
        return parseFloat(sum_total.toFixed(2));
    }

    item_info(row: any) {
        this.router.navigate(['/admin/itemview', {res: row.item_no}]);
    }
}
