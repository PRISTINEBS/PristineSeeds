import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemList} from '../../../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {EncriptDecript} from '../../../../../../@pristine/process/EncriptDecript';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-parentseedmastercreate',
  templateUrl: './parentseedmastercreate.component.html',
  styleUrls: ['./parentseedmastercreate.component.scss']
})
export class ParentseedmastercreateComponent implements OnInit {

  parentseedmasterform: FormGroup;

  variety_type: Array<String> = ["Foundation", "TL","Tissue Culture"]

  searchByItemNameorNo: string = '';
  searchByItemNameorNo_M: string = '';
  searchByItemNameorNo_F: string = '';
  searchByItemNameorNo_O: string = '';

  itemlist: ItemList[];
  itemlistm: ItemList[];
  itemlistf: ItemList[];
  itemlisto: ItemList[];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ParentseedmastercreateComponent>,
    private spinner: NgxSpinnerService,
    public webApiHttp: WebApiHttp,
    public _encryptdecrypt: EncriptDecript,
    private  router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _toasterService: ToastrService
  ) {

    this.parentseedmasterform = this.fb.group({
      variety_type: [null, Validators.required],
      ItemNo: [null, Validators.required],
      ItemNoM: [null],
      ItemNoF: [null],
      ItemNoO: [null],
    })
  }


  ngOnInit(): void {

    this.get_Item_For_All();

    if (this.data.flag == 'update') {

      this.parentseedmasterform.get("variety_type").setValue(this.data.row.variety_type)
      this.parentseedmasterform.get("variety_type").disable()
      this.get_Item(this.data.row.variety_type)
      this.parentseedmasterform.get("ItemNoM").setValue(this.data.row.parent_seed_code_m)
      this.parentseedmasterform.get("ItemNoF").setValue(this.data.row.parent_seed_code_f)
      this.parentseedmasterform.get("ItemNoO").setValue(this.data.row.parent_seed_code_o)
    }
  }

  get_Item_For_All() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindOnlyItem).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlistm = result as ItemList[];
          this.itemlistf = result as ItemList[];
          this.itemlisto = result as ItemList[];
        } else {
          this.itemlistm = [];
          this.itemlistf = [];
          this.itemlisto = [];
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

  setItemNo(variety_type : string){
    this.get_Item(variety_type)
  }

  get_Item(variety_type : string) {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItemClassSeed
        + this.parentseedmasterform.get('variety_type').value
        + '&name_or_no=' + this.searchByItemNameorNo).then(result => {
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
      }).finally(()=>{
        if (this.data.flag == 'update') {
          this.parentseedmasterform.get("ItemNo").setValue(this.data.row.item_no)
          this.parentseedmasterform.get("ItemNo").disable()
        }
      })
    } catch (e) {
      this._toasterService.error(e, 'Error');
      this.spinner.hide();
    }
  }

  get_Item_Male() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindOnlyItem
        + this.searchByItemNameorNo_M).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlistm = result as ItemList[];
        } else {
          this.itemlistm = [];
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

  get_Item_Female() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindOnlyItem
        + this.searchByItemNameorNo_F).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlistf = result as ItemList[];
        } else {
          this.itemlistf = [];
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

  get_Item_Other() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindOnlyItem
        + this.searchByItemNameorNo_O).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlisto = result as ItemList[];
        } else {
          this.itemlisto = [];
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

    if(this.parentseedmasterform.get('ItemNoM').value == null &&
      this.parentseedmasterform.get('ItemNoF').value == null &&
      this.parentseedmasterform.get('ItemNoO').value == null){
      this._toasterService.error('error', 'Please Select Any Of Parent Item');
      return;
    }

    var json: any;
    if (this.data.flag == 'update') {
      json = {
        item_no: this.data.row.item_no,
        parent_seed_code_m: this.parentseedmasterform.get("ItemNoM").value,
        parent_seed_code_f: (this.parentseedmasterform.get("ItemNoF").value),
        parent_seed_code_o: (this.parentseedmasterform.get("ItemNoO").value),
        flag: 'UPDATE',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
      }
    } else {
      json = {
        variety_type: this.parentseedmasterform.get("variety_type").value,
        item_no: this.parentseedmasterform.get("ItemNo").value,
        parent_seed_code_m: this.parentseedmasterform.get("ItemNoM").value,
        parent_seed_code_f: (this.parentseedmasterform.get("ItemNoF").value),
        parent_seed_code_o: (this.parentseedmasterform.get("ItemNoO").value),
        flag: 'INSERT',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
      }
    }
    try {
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.parent_seed_master_create, json)
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
