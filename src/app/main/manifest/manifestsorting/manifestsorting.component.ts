import {Component, OnInit} from '@angular/core';
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {FormControl} from "@angular/forms";
import {Manifestsortingmodel} from "./manifestsortingmodel";


@Component({
    selector: 'app-manifestsorting',
    templateUrl: './manifestsorting.component.html',
    styleUrls: ['./manifestsorting.component.scss']
})
export class ManifestsortingComponent implements OnInit {

    AWBNo = new FormControl('');
    sorting: Array<Manifestsortingmodel>

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private router: Router,
                private _encriptDecript: EncriptDecript,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {

    }

    awb_scan() {
        try {
            this.spinner.show();
            const json = {
                awb_no: this.AWBNo.value,
                created_by: this.sessionManageMent.getEmail,
                location_id: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ScanAwbNoManifestCreate, json).then(
                result => {
                    if (result[0].condition.toString().toLowerCase() == 'true') {
                        this.sorting = result;
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.AWBNo.setValue('');
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
}


