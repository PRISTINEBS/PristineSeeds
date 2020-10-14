import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemList} from '../../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {upload_sample_data} from '../samplecodemastermodel';

@Component({
  selector: 'app-samplecodemastercreate',
  templateUrl: './samplecodemastercreate.component.html',
  styleUrls: ['./samplecodemastercreate.component.scss']
})
export class SamplecodemastercreateComponent implements OnInit {

  samplecodemasterform: FormGroup;

  year: Array<String> = ["2020","2021", "2022","2023","2024","2025"]

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SamplecodemastercreateComponent>,
    private spinner: NgxSpinnerService,
    public webApiHttp: WebApiHttp,
    public _encryptdecrypt: EncriptDecript,
    private  router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _toasterService: ToastrService
  ) {

    this.samplecodemasterform = this.fb.group({
      lot_no: [null, Validators.required],
      sample_code: [null, Validators.required],
      year: [null, Validators.required],
    })
  }


  ngOnInit(): void {
  }

  CreateItemCategory() {

    var posteddataitems: Array<upload_sample_data> = [];

    var json: any;
    if (this.data.flag == 'insert') {
      json = {
        lot_no: this.samplecodemasterform.get("lot_no").value,
        sample_code: this.samplecodemasterform.get("sample_code").value,
        year: this.samplecodemasterform.get("year").value,
        flag: 'INSERT',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
      }
      posteddataitems.push(json);
    }

    const jsonvalue={
      lines: posteddataitems
    }

    try {
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.sample_code_uploader, jsonvalue)
        .then(result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toasterService.success('success', result[0].message)
            this.dialogRef.close('true');
          } else {
            this._toasterService.error('error', result[0].message)
          }
        }, error => {
          this._toasterService.error('error', error)
        })
    } catch (e) {
      this._toasterService.error('error', e)
    }
  }

  cancle() {
    this.dialogRef.close('true')
  }

}
