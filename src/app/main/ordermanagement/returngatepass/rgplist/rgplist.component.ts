import {Component, OnInit, ViewChild} from "@angular/core";
import {MatSort} from "@angular/material/sort";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-rgplist',
    templateUrl: './rgplist.component.html',
    styleUrls: ['./rgplist.component.scss']
})
export class RgplistComponent implements OnInit {

    displayedColumns: string[] = ['document_no', 'party_name', 'order_status', 'created_date', 'created_by', 'View', 'Update'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        public sessionManageMent: SessionManageMent,
        private webApiHttp: WebApiHttp,
        private router: Router,
        private _encriptDecript: EncriptDecript,
        private _toster: ToastrService,
        private spinner: NgxSpinnerService
    ) {

    }

    ngOnInit(): void {
        this.rgp_list();
    }

    rgp_list() {
        try {
            this.spinner.show();
            const json = {
                LocationId: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.RGPList, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<any>(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.spinner.hide();
                    return;
                }
            ).catch(e => {
                this.spinner.hide();
                this._toster.error(e, 'Error');
            })
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Error');
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

    create_rgp() {
        this.router.navigate(['/ordermanagement/rgpcreate', {
            response: this._encriptDecript.encrypt(JSON.stringify({
                type: "create"
            }))
        }]);
    }

    viewinfo(document_no: any) {
        this.router.navigate(['/ordermanagement/rgpcreate', {
            response: this._encriptDecript.encrypt(JSON.stringify({
                type: "view", document_no: document_no
            }))
        }]);
    }

    update_rgp(document_no: any) {
        this.router.navigate(['/ordermanagement/rgpcreate', {
            response: this._encriptDecript.encrypt(JSON.stringify({
                type: "update", document_no: document_no
            }))
        }]);
    }

}
