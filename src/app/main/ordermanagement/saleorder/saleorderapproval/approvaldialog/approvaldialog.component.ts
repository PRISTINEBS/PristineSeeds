import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-approvaldialog',
    templateUrl: './approvaldialog.component.html',
    styleUrls: ['./approvaldialog.component.scss']
})
export class ApprovaldialogComponent implements OnInit {

    approvaldata: FormGroup;
    orderstatus: string[] = ['Approved', 'Rejected']

    constructor(
        private dialogRef: MatDialogRef<ApprovaldialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private _formBuilder: FormBuilder,
        public sessionManageMent: SessionManageMent,
        private webApiHttp: WebApiHttp,
        private _toster: ToastrService,
    ) {
        this.approvaldata = _formBuilder.group(
            {
                OrderStatus: ['', Validators.required],
                Reason: ['']
            });
        this.approvaldata.get('Reason').disable();
    }

    ngOnInit(): void {
    }

    send() {
        this.dialogRef.close();
    }

    send_approval() {
        const json = {
            RejectionReason: this.approvaldata.get('Reason').value,
            SaleOrderNo: this.data,
            Orderstatus: this.approvaldata.get('OrderStatus').value,
            LocationId: this.sessionManageMent.getLocationId,
            CreatedBy: this.sessionManageMent.getEmail
        }

        this.dialogRef.close(json);

    }
}
