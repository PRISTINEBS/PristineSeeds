import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {Saleorderlistmodel} from "./saleorderlistmodel";

@Component({
    selector: 'app-saleorderlist',
    templateUrl: './saleorderlist.component.html',
    styleUrls: ['./saleorderlist.component.scss']
})
export class SaleorderlistComponent implements OnInit {

    search: FormGroup
    displayedColumns: string[] = ['document_no', 'shipping_address', 'order_datetime', 'order_status', 'dsp_code', 'gst_total', 'total_amount', 'grand_total', 'View'];
    dataSource: MatTableDataSource<Saleorderlistmodel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;


    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private router: Router,
                private _encriptDecript: EncriptDecript,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService,
                private _formgroup: FormBuilder,
                private _date: DatePipe) {
        this.search = _formgroup.group({
            StartDate: ['', Validators.required],
            EndDate: ['', Validators.required]
        });

        const currentYear = new Date().getFullYear();
        const currentmonth = new Date().getMonth();
        const currentday = new Date().getDate();
        this.search.get('StartDate').setValue(new Date(currentYear, currentmonth, currentday - 15))
        this.search.get('EndDate').setValue(new Date(currentYear, currentmonth, currentday))
    }

    ngOnInit(): void {
        this.get_sale_order()
    }

    create_sale_order() {
        this.router.navigateByUrl('/ordermanagement/saleordercreate');
    }

    get_sale_order() {
        try {
            this.spinner.show();
            const json = {
                Startdate: this._date.transform(this.search.get('StartDate').value.toLocaleString(), 'yyyy-MM-dd'),
                Enddate: this._date.transform(this.search.get('EndDate').value.toLocaleString(), 'yyyy-MM-dd'),
                LocationId: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.SaleOrderlist, json).then(result => {
                if (result[0].condition == 'True') {
                    this.dataSource = new MatTableDataSource<Saleorderlistmodel>(result);
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

    viewinfo(e) {
        this.router.navigate(['/ordermanagement/salesorderview', {response: e.document_no}]);
    }

    Search() {

    }
}
