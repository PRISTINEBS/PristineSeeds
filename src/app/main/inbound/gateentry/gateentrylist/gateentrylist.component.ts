import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GateEntryList} from "../GateEntryList";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-gateentrylist',
    templateUrl: './gateentrylist.component.html',
    styleUrls: ['./gateentrylist.component.scss']
})
export class GateentrylistComponent implements OnInit {

    displayedColumns: string[] = ['gate_entry_no', 'vender_no_or_company', 'vehicle_no', 'drive_name', 'driver_number', 'gate_entry_status', 'Action'];
    dataSource: MatTableDataSource<GateEntryList>;
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
        this.gateentry_list();
    }


    gateentry_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.AllGateEntryList + this.sessionManageMent.getLocationId).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<GateEntryList>(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.spinner.hide();
                    return;
                    //console.log(this.dataSource);
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

    creategateentry() {
        this.router.navigateByUrl('/inbound/creategateentry');
    }

    viewinfo(e) {
        this.router.navigate(['/inbound/gateentryinfoandupdate', {
            response: this._encriptDecript.encrypt(JSON.stringify({
                type: 'view',
                gateentryid: e
            }))
        }]);
    }
}
