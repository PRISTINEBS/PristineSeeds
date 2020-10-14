import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {ActivatedRoute, Router} from "@angular/router";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {CreatedspserviceabilityComponent} from "./createdspserviceability/createdspserviceability.component";

@Component({
    selector: 'app-dspserviceability',
    templateUrl: './dspserviceability.component.html',
    styleUrls: ['./dspserviceability.component.scss']
})
export class DspserviceabilityComponent implements OnInit {


    displayedColumns: string[] = ['dsp_code', 'pincode', 'express', 'reversepickup', 'priority', 'cost', 'Edit'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    inputjson: any

    constructor(
        public sessionManageMent: SessionManageMent,
        private webApiHttp: WebApiHttp,
        private router: Router,
        private _encriptDecript: EncriptDecript,
        private _toster: ToastrService,
        private spinner: NgxSpinnerService,
        private  dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        this.inputjson = this.route.snapshot.paramMap.get('res');
    }

    ngOnInit(): void {
        this.dsp_service_list();
    }

    dsp_service_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.DSPServiceList + this.sessionManageMent.getLocationId + '&dsp_code=' + this.inputjson).then(
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


    createnewdspservice() {
        const dialog = this.dialog.open(CreatedspserviceabilityComponent, {width: "800px"})
        dialog.afterClosed().subscribe(data => {
            if (data != undefined && data.hasOwnProperty('DSPCode')) {
                this.dsp_add_update(data);
            }
        });
    }

    updatedspservice(data) {
        const dialog = this.dialog.open(CreatedspserviceabilityComponent, {width: "800px", data});
        dialog.afterClosed().subscribe(data => {
            if (data != undefined && data.hasOwnProperty('DSPCode')) {
                this.dsp_add_update(data);
            }
        });
    }

    dsp_add_update(data: any) {
        try {
            this.spinner.show();
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateUpdateDSPService, data).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dsp_service_list();
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.spinner.hide();
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
}
