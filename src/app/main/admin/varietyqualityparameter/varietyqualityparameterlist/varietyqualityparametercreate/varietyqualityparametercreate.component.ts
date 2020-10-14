import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {EncriptDecript} from '../../../../../../@pristine/process/EncriptDecript';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ItemList} from '../../../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel';

@Component({
  selector: 'app-varietyqualityparametercreate',
  templateUrl: './varietyqualityparametercreate.component.html',
  styleUrls: ['./varietyqualityparametercreate.component.scss']
})
export class VarietyqualityparametercreateComponent implements OnInit {

  varietyqualityparameterform: FormGroup;

  parameter: Array<String> = ["Genetic Pure Plants %","Off Type Plant %", "Self Plant %",
    "Positive for CRY 1AC %","Positive for CRY 2AB %","Normal Seed Lings","Cut Seed %","Inert Matter %",
    "Insect Damage %","Objectionable Weed Seed","Other Crop Seed","Other Disting. Seed","Pure Seed %",
    "Non-Vapour Proof %","Vapour Proof %","Vigour Test"]

  type: Array<String> = ["GOT Test","BT/ELISA Test", "Germination Test","Physical Purity Test",
    "Moisture Test","Vigour Test"]

  parameter_value_calc: Array<String> = [">","<", "=",">=","<="]

  searchByItemNameorNo: string = '';
  itemlist: ItemList[];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<VarietyqualityparametercreateComponent>,
    private spinner: NgxSpinnerService,
    public webApiHttp: WebApiHttp,
    public _encryptdecrypt: EncriptDecript,
    private  router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _toasterService: ToastrService
  ) {

    this.varietyqualityparameterform = this.fb.group({
      type: [null, Validators.required],
      ItemNo: [null, Validators.required],
      parameter: [null, Validators.required],
      parameter_value_calc: [null, Validators.required],
      value: [0],
    })
  }


  ngOnInit(): void {

    this.get_Item();

    if (this.data.flag == 'update') {
      this.varietyqualityparameterform.get("type").setValue(this.data.row.type)
      this.varietyqualityparameterform.get("type").disable()
      this.varietyqualityparameterform.get("ItemNo").setValue(this.data.row.item_no)
      this.varietyqualityparameterform.get("ItemNo").disable()
      this.varietyqualityparameterform.get("parameter").setValue(this.data.row.parameter)
      this.varietyqualityparameterform.get("parameter").disable()
      this.varietyqualityparameterform.get("parameter_value_calc").setValue(this.data.row.parameter_value_calc)
      this.varietyqualityparameterform.get("value").setValue(this.data.row.value)
    }
  }

  get_Item() {
    try {
      this.spinner.show();
      console.log(this.searchByItemNameorNo);
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindOnlyItem
          + this.searchByItemNameorNo).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlist = result as ItemList[];
        } else {
          this.itemlist = [];
          this._toasterService.error(result[0].message, 'Error');
        }
        this.spinner.hide();
      }).catch(e => {
        this._toasterService.error(e, 'Error');
        this.spinner.hide();
      })
    } catch (e) {
      this._toasterService.error(e, 'Error');
      this.spinner.hide();
    }
  }

  CreateItemCategory() {
    var json: any;
    if (this.data.flag == 'update') {
      json = {
        id: this.data.row.id,
        parameter_value_calc: this.varietyqualityparameterform.get("parameter_value_calc").value,
        value: (this.varietyqualityparameterform.get("value").value),
        flag: 'UPDATE',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
      }
    } else {
      json = {
        item_no: this.varietyqualityparameterform.get("ItemNo").value,
        parameter: this.varietyqualityparameterform.get("parameter").value,
        value: this.varietyqualityparameterform.get("value").value,
        parameter_value_calc: this.varietyqualityparameterform.get("parameter_value_calc").value,
        type: (this.varietyqualityparameterform.get("type").value),
        flag: 'INSERT',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
      }
    }
    try {
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.variety_wise_quality_parameter_create, json)
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
