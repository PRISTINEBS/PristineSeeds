import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SessionManageMent} from '../../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-tlapprovaldialog',
  templateUrl: './tlapprovaldialog.component.html',
  styleUrls: ['./tlapprovaldialog.component.scss']
})
export class TlapprovaldialogComponent implements OnInit {

  approvaldata: FormGroup;
  orderstatus: string[] = ['Approved', 'Rejected']

  constructor(
    private dialogRef: MatDialogRef<TlapprovaldialogComponent>,
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
      TLSeedArrivalNo: this.data,
      Orderstatus: this.approvaldata.get('OrderStatus').value,
      LocationId: this.sessionManageMent.getLocationId,
      CreatedBy: this.sessionManageMent.getEmail
    }

    this.dialogRef.close(json);

  }
}
