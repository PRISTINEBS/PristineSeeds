import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {CreatedspComponent} from "./createdsp/createdsp.component";

@Component({
    selector: 'app-dsplist',
    templateUrl: './dsplist.component.html',
    styleUrls: ['./dsplist.component.scss']
})
export class DsplistComponent implements OnInit {

    displayedColumns: string[] = ['dsp_code', 'description', 'api_url', 'address', 'gst_no', 'state', 'country', 'Edit', 'View'];
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
        private  dialog: MatDialog
    ) {

    }

    ngOnInit(): void {
        this.dsp_list();
    }

    dsp_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.DSPPartnerList + this.sessionManageMent.getLocationId).then(
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

    createnewdsp() {
        const dialog = this.dialog.open(CreatedspComponent, {width: "800px"})
        dialog.afterClosed().subscribe(data => {
            if (data != undefined && data.hasOwnProperty('DSPCode')) {
                this.dsp_add_update(data);
            }
        });
    }

    updatedsp(data) {
        const dialog = this.dialog.open(CreatedspComponent, {width: "800px", data});
        dialog.afterClosed().subscribe(data => {
            console.log(data);
            if (data != undefined && data.hasOwnProperty('DSPCode')) {
                this.dsp_add_update(data);
            }
        });
    }

    viewinfo(element: any) {
        this.router.navigate(['/admin/dspserviceability', {res: element.dsp_code}])
    }

    dsp_add_update(data: any) {
        try {
            this.spinner.show();
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateUpdateDSP, data).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dsp_list();
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

    findawbno() {
        this.router.navigate(['/admin/dspawb']);
    }
}
