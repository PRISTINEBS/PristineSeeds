import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {GRNlistmodel} from "../putwaylistmodel";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-putwaycreate',
    templateUrl: './putwaycreate.component.html',
    styleUrls: ['./putwaycreate.component.scss']
})
export class PutwaycreateComponent implements OnInit {

    newputway: FormGroup;
    documentType: string[] = ['Purchase Order', 'Inbound Transfer Order', 'Return to Origin', 'Customer Return'];
    searchGRNHeaderNo: string;
    searchByputwaytype: string;
    grnHeaderlist: GRNlistmodel[];

    constructor(private dialogRef: MatDialogRef<PutwaycreateComponent>,
                private _formBuilder: FormBuilder,
                public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _toster: ToastrService,
                private datePipe: DatePipe,
                private spinner: NgxSpinnerService) {
        this.newputway = _formBuilder.group(
            {
                PutwayType: ['', Validators.required],
                GRNHeaderNo: ['', Validators.required]
            }
        );
    }

    ngOnInit(): void {

    }

    get_grn_header() {
        try {
            this.spinner.show();
            const json = {
                LocationId: this.sessionManageMent.getLocationId,
                Type: this.newputway.get('PutwayType').value
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PutwayGRNList, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.grnHeaderlist = result;
                        this.newputway.get('GRNHeaderNo').setValue('');
                    } else {
                        this.grnHeaderlist = null;
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

    Createputway() {
        const json = {
            PutwayType: this.newputway.get('PutwayType').value,
            CreatedBy: this.sessionManageMent.getEmail,
            GRNHeaderNo: this.newputway.get('GRNHeaderNo').value,
            LocationId: this.sessionManageMent.getLocationId
        }
        this.dialogRef.close(json);
    }
}
