import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {EncriptDecript} from '../../../../../../@pristine/process/EncriptDecript';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-cropstagemastercreate',
  templateUrl: './cropstagemastercreate.component.html',
  styleUrls: ['./cropstagemastercreate.component.scss']
})
export class CropstagemastercreateComponent implements OnInit {

  cropstagemasterform: FormGroup;
  CropType: Array<String> = ["COTTON","FIELD CROP", "VEGETABLE"]
  Stage: Array<String> = ["RAW","GIN", "DINT","PROCESS", "CLEANING","PACKING", "LINT", "REMINANT"]
  Sequence: Array<String> = ["1","2", "3","4", "5","6", "7", "8"]

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CropstagemastercreateComponent>,
    private spinner: NgxSpinnerService,
    public webApiHttp: WebApiHttp,
    public _encryptdecrypt: EncriptDecript,
    private  router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _toasterService: ToastrService
  ) {

    this.cropstagemasterform = this.fb.group({
      crop_type: [null, Validators.required],
      stage: [null, Validators.required],
      sequence: [null, Validators.required],
      description: [null],
      got_test: [0],
      bt_elisa_test: [0],
      stl_germination_test: [0],
      stl_physical_purity: [0],
      stl_moisture: [0],
      stl_vigour: [0],
    })
  }


  ngOnInit(): void {

    if (this.data.flag == 'update') {
      this.cropstagemasterform.get("crop_type").setValue(this.data.row.crop_code)
      this.cropstagemasterform.get("crop_type").disable()
      this.cropstagemasterform.get("stage").setValue(this.data.row.stage)
      this.cropstagemasterform.get("stage").disable()
      this.cropstagemasterform.get("sequence").setValue(this.data.row.sequence)
      this.cropstagemasterform.get("sequence").disable()
      this.cropstagemasterform.get("description").setValue(this.data.row.description)
      this.cropstagemasterform.get("got_test").setValue( this.data.row.got_test == 1 ? true : false )
      this.cropstagemasterform.get("bt_elisa_test").setValue(this.data.row.bt_elisa_test == 1 ? true : false)
      this.cropstagemasterform.get("stl_germination_test").setValue(this.data.row.stl_germination_test == 1 ? true : false)
      this.cropstagemasterform.get("stl_physical_purity").setValue(this.data.row.stl_physical_purity == 1 ? true : false)
      this.cropstagemasterform.get("stl_moisture").setValue(this.data.row.stl_moisture == 1 ? true : false)
      this.cropstagemasterform.get("stl_vigour").setValue(this.data.row.stl_vigour == 1 ? true : false)
    }
  }

  setSequence(stage : any){
    if(stage == 'RAW'){
      this.cropstagemasterform.get('sequence').setValue('1')
    }else if(stage == 'GIN'){
      this.cropstagemasterform.get('sequence').setValue('2')
    }else if(stage == 'DINT'){
      this.cropstagemasterform.get('sequence').setValue('3')
    }else if(stage == 'PROCESS'){
      this.cropstagemasterform.get('sequence').setValue('4')
    }else if(stage == 'CLEANING'){
      this.cropstagemasterform.get('sequence').setValue('5')
    }else if(stage == 'PACKING'){
      this.cropstagemasterform.get('sequence').setValue('6')
    }else if(stage == 'LINT'){
      this.cropstagemasterform.get('sequence').setValue('7')
    }else if(stage == 'REMINANT'){
      this.cropstagemasterform.get('sequence').setValue('8')
    }
  }

  CreateItemCategory() {
    var json: any;
    if (this.data.flag == 'update') {
      json = {
        crop_code: this.cropstagemasterform.get("crop_type").value,
        stage: this.cropstagemasterform.get("stage").value,
        sequence: this.cropstagemasterform.get("sequence").value,
        description: this.cropstagemasterform.get("description").value,
        got_test: (this.cropstagemasterform.get("got_test").value.toString() == 'true' ? 1 : 0 ),
        bt_elisa_test: (this.cropstagemasterform.get("bt_elisa_test").value.toString()  == 'true' ? 1 : 0),
        stl_germination_test: (this.cropstagemasterform.get("stl_germination_test").value.toString() == 'true' ? 1 : 0),
        stl_physical_purity: (this.cropstagemasterform.get("stl_physical_purity").value.toString() == 'true' ? 1 : 0),
        stl_moisture: (this.cropstagemasterform.get("stl_moisture").value.toString() == 'true' ? 1 : 0),
        stl_vigour: (this.cropstagemasterform.get("stl_vigour").value.toString() == 'true' ? 1 : 0),
        flag: 'UPDATE',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
      }
    } else {
      json = {
        crop_code: this.cropstagemasterform.get("crop_type").value,
        stage: this.cropstagemasterform.get("stage").value,
        sequence: this.cropstagemasterform.get("sequence").value,
        description: this.cropstagemasterform.get("description").value,
        got_test: (this.cropstagemasterform.get("got_test").value.toString() == 'true' ? 1 : 0 ),
        bt_elisa_test: (this.cropstagemasterform.get("bt_elisa_test").value.toString()  == 'true' ? 1 : 0),
        stl_germination_test: (this.cropstagemasterform.get("stl_germination_test").value.toString() == 'true' ? 1 : 0),
        stl_physical_purity: (this.cropstagemasterform.get("stl_physical_purity").value.toString() == 'true' ? 1 : 0),
        stl_moisture: (this.cropstagemasterform.get("stl_moisture").value.toString() == 'true' ? 1 : 0),
        stl_vigour: (this.cropstagemasterform.get("stl_vigour").value.toString() == 'true' ? 1 : 0),
        flag: 'INSERT',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
      }
    }
    try {
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.crop_stage_master_create, json)
        .then(result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toasterService.success('success', result[0].message)
            this.dialogRef.close('true');
          } else {
            this._toasterService.error('error', result[0].message)
            this.dialogRef.close('true');
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
