import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ActivatedRoute, Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {Pickmanualmodel} from "./pickmanualmodel";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: 'app-pickmanual',
    templateUrl: './pickmanual.component.html',
    styleUrls: ['./pickmanual.component.scss']
})
export class PickmanualComponent implements OnInit, AfterViewInit {

    inputjson: any
    bincode = new FormControl();
    barcode = new FormControl();
    picklines: Array<Pickmanualmodel> = [];
    total_qty: number = 0;
    picked_qty: number = 0;
    no_of_nf: number = 0;
    not_available: number = 0;

    constructor(
        public sessionManageMent: SessionManageMent,
        private webApiHttp: WebApiHttp,
        private router: Router,
        private _encriptDecript: EncriptDecript,
        private _toster: ToastrService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('res')));

    }

    ngOnInit(): void {
        this.pick_info();
    }

    nf_no() {
        this.picklines.forEach((element) => {
            if (element.pick_status == 32 || element.pick_status == 33 || element.pick_status == 35) {
                this.total_qty += element.qty_ordered;
                if (element.pick_status == 33) {
                    this.picked_qty += element.qty_picked;
                }
            }
            if (element.pick_status == 34 || element.pick_status == 35) {
                this.no_of_nf += 1;
                if (element.pick_status == 35) {
                    this.not_available += element.qty_ordered;
                }
            }
        })
    }


    pick_info() {
        try {
            this.spinner.show();
            const json = {
                PickNo: this.inputjson.Pick,
                EmailId: this.inputjson.Picker,
                LocationId: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickManualInfo, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.picklines = result;
                        this.nf_no();
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

    async scanbinvalidation() {
        if (this.bincode.value == '') {
            this._toster.error("Please Scan Bincode ", "Error");
            this.bincode.setValue('');
            document.getElementById('scanbin').focus();
            return false;
        } else {
            this.barcode.setValue('');
            document.getElementById('scanbarcode').focus();
            return true;
        }

    }

    async scanbarcodevalidation(value: any) {
        try {
            this.spinner.show();
            if (await this.scanbinvalidation()) {
                const json = {
                    EmailId: this.picklines[0].assign_to,
                    PickNo: this.picklines[0].pick_no,
                    Bincode: this.bincode.value,
                    Barcode: value,
                    LocationId: this.sessionManageMent.getLocationId
                }

                await this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickScanManual, json).then(
                    async result => {
                        if (result[0].condition.toString().toLowerCase() == "true") {
                            this.picklines = result;
                            this.nf_no();
                        } else if (result[0].condition.toString().toLowerCase() == "false") {
                            this._toster.error(result[0].message.toString(), "Error");
                        }
                        this.barcode.setValue('');
                        this.bincode.setValue('');
                        document.getElementById('scanbin').focus();
                    }
                ).catch(err => {
                    this.spinner.hide();
                })
            }
        } finally {
            this.spinner.hide();
        }
    }

    async notfound(element: any) {
        try {
            var dialog = this.dialog.open(pristineConfirmDialogComponent)
            dialog.componentInstance.confirmMessage = 'Please Confirm before Not Found.'
            dialog.afterClosed().subscribe(async result => {
                if (result == true) {
                    this.spinner.show();
                    const json = {
                        EmailId: this.picklines[0].assign_to,
                        PickNo: this.picklines[0].pick_no,
                        PickLineNo: element.pick_line_no,
                        LocationId: this.sessionManageMent.getLocationId
                    }

                    await this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickNFManual, json).then(
                        async result => {
                            if (result[0].condition.toString().toLowerCase() == "true") {
                                this.picklines = result;
                                this.nf_no();
                                this._toster.info(result[0].message.toString(), "Info");
                            } else if (result[0].condition.toString().toLowerCase() == "false") {
                                this._toster.error(result[0].message.toString(), "Error");
                            }
                            this.barcode.setValue('');
                            this.bincode.setValue('');
                            document.getElementById('scanbin').focus();
                            this.spinner.hide();
                        }
                    ).catch(err => {
                        this.spinner.hide();
                    })
                    this.spinner.hide();
                }
            })

        } finally {
            this.spinner.hide();
        }
    }

    async complete_pick() {
        try {
            this.spinner.show();
            const json = {
                EmailId: this.picklines[0].assign_to,
                PickNo: this.picklines[0].pick_no,
                LocationId: this.sessionManageMent.getLocationId
            }

            await this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickComplete, json).then(
                async result => {
                    if (result[0].condition.toString().toLowerCase() == "true") {
                        this._toster.success(result[0].message.toString(), "Success");
                        this.router.navigate(['/outbound/picklist']);
                    } else if (result[0].condition.toString().toLowerCase() == "false") {
                        this._toster.error(result[0].message.toString(), "Error");
                    }
                    this.barcode.setValue('');
                    this.bincode.setValue('');
                    document.getElementById('scanbin').focus();
                }
            ).catch(err => {
                this.spinner.hide();
            })

        } finally {
            this.spinner.hide();
        }
    }

    ngAfterViewInit(): void {
        document.getElementById('scanbin').focus();
    }

    getColor(line: Pickmanualmodel) {
        switch (line.pick_status) {
            case 32:
                return 'transparent';
                break;
            case 33:
                return '#ccf4cc';
                break;
            case 34:
                return '#dedcdc';
                break;
            case 35:
                return '#f7b9b9';
                break;
            case 60:
                return '#abf6f5';
                break;
        }

    }
}
