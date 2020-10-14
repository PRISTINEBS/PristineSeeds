import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Saleinvoicemodel} from "./saleinvoicemodel";
import {isArray} from "rxjs/internal-compatibility";

@Component({
    selector: 'app-saleinvoice',
    templateUrl: './saleinvoice.component.html',
    styleUrls: ['./saleinvoice.component.scss']
})

export class SaleinvoiceComponent implements OnInit {

    order: Saleinvoicemodel
    sales_invoice_no: string;
    displayedColumns: string[] = ['item_no', 'item_desc', 'barcode_no', 'quantity', 'amount', 'discount_amount', 'gst_amount', 'grand_total', 'order_status'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;


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

    reverse_pickup() {
        this.router.navigate(['/return/reversepickup', {response: this.sales_invoice_no}]);
    }
}
