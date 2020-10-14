import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-newbin',
    templateUrl: './newbin.component.html',
    styleUrls: ['./newbin.component.scss']
})
export class NewbinComponent implements OnInit {

    newbin: FormGroup;
    binType: Array<string> = ['REJECT', 'PUT', 'PUTPICK', 'NF'];

    constructor(private dialogRef: MatDialogRef<NewbinComponent>,
                @Inject(MAT_DIALOG_DATA) public data,
                private _formBuilder: FormBuilder,
                public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _toster: ToastrService,
    ) {

        this.newbin = _formBuilder.group(
            {
                BinType: ['', Validators.required],
                Bincode: ['', Validators.required],
                Zone: ['', Validators.required],
                Row: ['', Validators.required],
                Rack: ['', Validators.required],
                Sequence: ['', Validators.required],
                LocationId: [this.sessionManageMent.getLocationId]
            });
    }

    ngOnInit(): void {

    }

    send() {
        this.dialogRef.close();
    }

    CreateBIN() {
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AddBin, this.newbin.value).then(
            result => {
                if (result[0].condition == 'True') {
                    this.dialogRef.close(result[0]);
                } else {
                    this._toster.error(result[0].message, 'Error');
                }
            }
        ).catch(error => {
            this._toster.error(error, 'Error');
        })
    }
}
