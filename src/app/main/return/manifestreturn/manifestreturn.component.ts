import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {Manifestreturnmodel} from "./manifestreturnmodel";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
    selector: 'app-manifestreturn',
    templateUrl: './manifestreturn.component.html',
    styleUrls: ['./manifestreturn.component.scss']
})
export class ManifestreturnComponent implements OnInit {

    inputjson: any;
    returninfo: Array<Manifestreturnmodel>;
    displayedColumns: string[] = ['invoice_no', 'invoice_date', 'order_no', 'awb_no', 'customer_id', 'ship_to_info', 'payment_type'];
    dataSource: MatTableDataSource<any>;
    awbno = new FormControl('', [Validators.required]);
    rejectionreason = new FormControl('', [Validators.required]);

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    rejection_reason: string[] = ['Address Not Found', 'No Response', 'Customer Rejected', 'Expired'];

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private _encriptDecript: EncriptDecript,
                private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService,
    ) {
        this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')));
        console.log(this.inputjson);
    }

    ngOnInit(): void {
        this.manifestreturn_list();
    }

    manifestreturn_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ReturnManifestInfo + this.inputjson.return_manifest_no).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.returninfo = result;
                        if (this.returninfo[0].awb_no != null) {
                            this.dataSource = new MatTableDataSource<any>(this.returninfo);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                        }

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

    manifest_return_complete() {
        try {
            this.spinner.show();
            const json = {
                ReturnManifestNo: this.returninfo[0].return_manifest_no
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.Complete, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.router.navigate(['/return/manifestreturnlist']);
                        this._toster.success(result[0].message, 'Success');
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.awbno.setValue('');
                    this.rejectionreason.setValue('');
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

    scanawbno() {
        if (this.rejectionreason.valid && this.awbno.valid) {
            try {
                this.spinner.show();
                const json = {
                    ReturnManifestNo: this.returninfo[0].return_manifest_no,
                    AWBNo: this.awbno.value,
                    Returnreson: this.rejectionreason.value
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AWBScan, json).then(
                    result => {
                        if (result[0].condition == 'True') {
                            this.returninfo = result;
                            if (this.returninfo[0].awb_no != null) {
                                this.dataSource = new MatTableDataSource<any>(this.returninfo);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                            }
                        } else {
                            this._toster.warning(result[0].message, 'Message');
                        }
                        this.awbno.setValue('');
                        this.rejectionreason.setValue('');
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
}
