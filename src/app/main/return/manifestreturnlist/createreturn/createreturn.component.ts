import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl} from "@angular/forms";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-createreturn',
    templateUrl: './createreturn.component.html',
    styleUrls: ['./createreturn.component.scss']
})
export class CreatereturnComponent implements OnInit {

    dsppartnew = new FormControl('');
    searchBydsp: string;
    dspList: any[];

    constructor(private dialogRef: MatDialogRef<CreatereturnComponent>,
                private _formBuilder: FormBuilder,
                public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService) {
        this.get_dsp_list();
    }

    ngOnInit(): void {

    }

    get_dsp_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.DSPPartnerList + this.sessionManageMent.getLocationId + '&code=1').then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dspList = result
                    } else {
                        this._toster.error(result[0].message, 'Error');
                    }
                    this.spinner.hide();
                }
            ).catch(e => {
                this.spinner.hide();
            })
        } catch (e) {
            this.spinner.hide();
        }
    }

    send() {
        this.dialogRef.close();
    }

    create_manifest_return() {
        const json = {
            DSP: this.dsppartnew.value,
            CreatedBy: this.sessionManageMent.getEmail,
            LocationId: this.sessionManageMent.getLocationId
        }
        this.dialogRef.close(json);
    }
}
