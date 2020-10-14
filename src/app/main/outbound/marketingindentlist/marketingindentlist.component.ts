import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Component, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Marketingindentlistmodel} from "./marketingindentlistmodel";

@Component({
    selector: 'app-purchaseorderlist',
    templateUrl: './marketingindentlist.component.html',
    styleUrls: ['./marketingindentlist.component.scss']
})
export class MarketingindentlistComponent implements OnInit {

    displayedColumns: string[] = ['document_no','customer_no', 'customer_name', 'season', 'zone', 'date', 'created_by', 'Action'];
    dataSource: MatTableDataSource<Marketingindentlistmodel>;
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
        this.get_marketing_indent_list()
    }

    get_marketing_indent_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.MarketingIndentList + this.sessionManageMent.getLocationId).then(result => {
                if (result[0].condition == 'True') {
                    this.dataSource = new MatTableDataSource<Marketingindentlistmodel>(result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                } else {
                    this._toster.info('Order Not Found', 'Info')
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
        this.router.navigateByUrl('/outbound/createmarketingindent');
    }


    viewinfo(e) {
        this.router.navigate(['/ordermanagement/purchaseorderview', {response: e}]);
    }

}
