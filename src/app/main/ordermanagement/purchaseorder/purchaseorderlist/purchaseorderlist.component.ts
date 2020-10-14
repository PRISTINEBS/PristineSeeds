import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Component, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Purchaseorderlistmodel} from "./purchaseorderlistmodel";

@Component({
    selector: 'app-purchaseorderlist',
    templateUrl: './purchaseorderlist.component.html',
    styleUrls: ['./purchaseorderlist.component.scss']
})
export class PurchaseorderlistComponent implements OnInit {

    displayedColumns: string[] = ['document_no','gate_entry_no', 'vendor_name', 'order_date','pay_terms', 'document_status', 'Action'];
    dataSource: MatTableDataSource<Purchaseorderlistmodel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;


    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private router: Router,
                private _encriptDecript: EncriptDecript,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
        this.get_purchase_order()
    }

    get_purchase_order() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.PurchaseOrderlist + this.sessionManageMent.getLocationId).then(result => {
                if (result[0].condition == 'True') {
                    this.dataSource = new MatTableDataSource<Purchaseorderlistmodel>(result);
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

    create_purchase_order() {
        this.router.navigateByUrl('/ordermanagement/purchaseordercreate');
    }


    viewinfo(e) {
        this.router.navigate(['/ordermanagement/purchaseorderview', {response: e}]);
    }

}
