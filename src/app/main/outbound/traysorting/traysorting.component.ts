import {Component, OnInit} from '@angular/core';
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {FormControl} from "@angular/forms";
import {Traysortingmodel} from "./traysortingmodel";

@Component({
    selector: 'app-traysorting',
    templateUrl: './traysorting.component.html',
    styleUrls: ['./traysorting.component.scss']
})
export class TraysortingComponent implements OnInit {

    ScanTray = new FormControl('');
    ScanCage = new FormControl('');
    traySortingModel: Traysortingmodel[];


    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
        this.tray_scan();
    }

    tray_scan() {
        try {
            this.spinner.show();
            const json = {
                EmailID: this.sessionManageMent.getEmail,
                Tray: this.ScanTray.value,
                LocationId: this.sessionManageMent.getLocationId
            }

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ScanTray, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.traySortingModel = result;
                        this.ScanTray.setValue(this.traySortingModel[0].tray);
                        document.getElementById('cage').focus();

                    } else if (result[0].message.toString().length > 2) {
                        this._toster.error(result[0].message, 'Error');
                    } else {
                        document.getElementById('tray').focus();
                    }
                    this.spinner.hide();
                }).catch()

        } catch (e) {
            this.spinner.hide();
        }
    }

    cage_scan() {
        try {
            this.spinner.show();
            const json = {
                EmailID: this.sessionManageMent.getEmail,
                Tray: this.ScanTray.value,
                Cage: this.ScanCage.value,
                LocationId: this.sessionManageMent.getLocationId
            }

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ScanCage, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this._toster.success(result[0].message, 'Success');
                        this.traySortingModel = null;
                        this.ScanTray.setValue('');
                        this.ScanCage.setValue('');
                        document.getElementById('tray').focus();
                    } else {
                        this._toster.error(result[0].message, 'Error');
                    }
                    this.spinner.hide();
                }).catch(err => {
                this.spinner.hide();
            })
        } catch (e) {
            this.spinner.hide();
        }
    }
}
