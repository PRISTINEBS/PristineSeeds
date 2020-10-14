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
import {isArray} from "rxjs/internal-compatibility";
import {Saleorderviewmodel} from "./saleorderviewmodel";

@Component({
    selector: 'app-saleorderview',
    templateUrl: './saleorderview.component.html',
    styleUrls: ['./saleorderview.component.scss']
})
export class SaleorderviewComponent implements OnInit {

    sales_no: string;
    order: Saleorderviewmodel;
    displayedColumns: string[] = ['item_no', 'ordered_quantity', 'reserved_quantity', 'pick_ready_quantity', 'amount', 'discount', 'total_amount', 'gst_amount', 'grand_total', 'line_status'];
    invoicedisplayedColumns: string[] = ['sales_invoice_no', 'box_code', 'dsp_code', 'awb_no', 'invoice_datetime', 'grand_total', 'order_status', 'View'];
    dataSource: MatTableDataSource<any>;
    invoicedataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService) {
        this.sales_no = this.route.snapshot.paramMap.get('response')
    }

    ngOnInit(): void {
        this.get_sale_order_info();
        this.get_sale_invoice_list();
    }

    get_sale_order_info() {
        try {
            this.spinner.show();
            const json = {
                SaleOrderNo: this.sales_no,
                LocationId: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.SaleInfo, json).then(result => {
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

    get_sale_invoice_list() {
        try {
            this.spinner.show();
            const json = {
                SaleOrderNo: this.sales_no,
                LocationId: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.SaleInvoiceList, json).then(result => {
                if (result[0].condition == 'True') {
                    this.invoicedataSource = new MatTableDataSource<any>(result);
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

    viewinfo(element: any) {
        this.router.navigate(['/ordermanagement/saleinvoiceview', {response: element.sales_invoice_no}]);
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
        this.router.navigate(['/admin/itemview', {res: row}]);
    }
}
