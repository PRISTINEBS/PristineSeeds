import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {CreatereturnComponent} from "./createreturn/createreturn.component";

@Component({
    selector: 'app-manifestreturnlist',
    templateUrl: './manifestreturnlist.component.html',
    styleUrls: ['./manifestreturnlist.component.scss']
})
export class ManifestreturnlistComponent implements OnInit {

    displayedColumns: string[] = ['return_manifest_no', 'return_manifest_datetime', 'dsp_code', 'status', 'total_weight', 'total_packages', 'created_by', 'View', 'Update'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        public sessionManageMent: SessionManageMent,
        private webApiHttp: WebApiHttp,
        private router: Router,
        private _encriptDecript: EncriptDecript,
        private _toster: ToastrService,
        private spinner: NgxSpinnerService,
        private composedilog: MatDialog,
    ) {

    }

    ngOnInit(): void {
        this.manifestreturn_list();
    }


    manifestreturn_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ReturnManifestList + this.sessionManageMent.getLocationId).then(
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

    new_manifest_return() {
        const dialog = this.composedilog.open(CreatereturnComponent, {
            width: "650px",
        });
        dialog.afterClosed().subscribe(
            data => {
                if (data != undefined && data.hasOwnProperty('DSP')) {
                    this.spinner.show();
                    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateReturn, data).then(
                        result => {
                            if (result[0].condition == 'True') {
                                this.spinner.hide();
                                this.router.navigate(['/return/manifestreturn', {
                                    response: this._encriptDecript.encrypt(JSON.stringify({
                                        return_manifest_no: result[0].return_manifest_no, type: 'update'
                                    }))
                                }]);
                            } else {
                                this._toster.error(result[0].message, 'Error');
                            }
                            this.spinner.hide();
                        }
                    ).catch(error => {
                        this.spinner.hide();
                        this._toster.error(error, 'Error');
                    })
                }
            });

    }

    viewinfo(return_manifest_no: any) {
        this.router.navigate(['/return/manifestreturn', {
            response: this._encriptDecript.encrypt(JSON.stringify({
                return_manifest_no: return_manifest_no, type: 'view'
            }))
        }]);

    }

    update_manifestreturn(return_manifest_no: any) {
        this.router.navigate(['/return/manifestreturn', {
            response: this._encriptDecript.encrypt(JSON.stringify({
                return_manifest_no: return_manifest_no, type: 'update'
            }))
        }]);
    }

}
