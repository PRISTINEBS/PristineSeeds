import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemList} from '../../../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {EncriptDecript} from '../../../../../../@pristine/process/EncriptDecript';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {LocationList} from '../../../../inbound/gateentry/creategateentry/creategateentry';
import {SessionManageMent} from '../../../../../../@pristine/process/SessionManageMent';
import {CropStagemodel} from '../../../../admin/itemmanagement/itemcategory/itemcategorymodel';
import {SeasonMastermodel} from '../../../../processtransfer/processtransfercreate/processtransfercreatemodel';
import {CustomerList} from '../../../../outbound/deliveryorder/createdeliveryorder/createdeliveryordermodel';

@Component({
  selector: 'app-plantingcreate',
  templateUrl: './plantingcreate.component.html',
  styleUrls: ['./plantingcreate.component.scss']
})
export class PlantingcreateComponent implements OnInit {

  plantingCreateForm: FormGroup;
  locationlist: Array<{location_id:string;location_name:string}>;
  searchByCustomerNameorNo: string = '';
  customerlist: CustomerList[];
  get_crop_stage_master: CropStagemodel[];
  seasonMaster: Array<SeasonMastermodel> = [];
  organiser_code: string = '';
  organiser_name: string = '';

  constructor(
    public sessionManageMent: SessionManageMent,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PlantingcreateComponent>,
    private spinner: NgxSpinnerService,
    public webApiHttp: WebApiHttp,
    public _encryptdecrypt: EncriptDecript,
    private  router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _toasterService: ToastrService
  ) {

    this.plantingCreateForm = this.fb.group({
      location: [null, Validators.required],
      CustomerNameorNo: [null, Validators.required],
      season: [null, Validators.required],
    })
  }


  ngOnInit(): void {

    this.get_location();
    this.get_CustomerNo();
    this.get_season_master();

  }

  get_location() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.locationlist).then(result => {
        this.locationlist = result as LocationList[];
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
        this._toasterService.error(e, 'Error');
      }).finally(()=>{
        this.plantingCreateForm.get('location').setValue(parseInt(this.sessionManageMent.getLocationId));
      })
    } catch (e) {
      this.spinner.hide();
      this._toasterService.error(e, 'Error');
    }
  }

  get_CustomerNo() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindCustomer + this.searchByCustomerNameorNo).then(result => {
        this.customerlist = result as CustomerList[];
        if (result[0].condition.toLowerCase() != 'true') {
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

  get_season_master() {
    try {
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetSeasonMaster)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.seasonMaster = result as SeasonMastermodel[];
          } else {
            this._toasterService.error('error', 'Season Master not found');
            this.plantingCreateForm.get('season').setValue('')
          }
        }, error => {
          this._toasterService.error('error', error)
        })
    } catch (e) {
      this._toasterService.error('error', e)
    }
  }

  setOrganiserDetails(cust_list : any){
    this.organiser_code = cust_list.customer_id;
    this.organiser_name = cust_list.full_name;
  }

  CreateItemCategory() {
    var json: any;

    json = {
      location_id: this.plantingCreateForm.get("location").value,
      organiser_code: this.organiser_code,
      organiser_name: this.organiser_name,
      season: this.plantingCreateForm.get("season").value,
      created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
    }

    try {
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PlantingCreate, json)
        .then(result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.dialogRef.close('true');
            this.router.navigate(['/plantinginspection/plantingview', {res: this._encryptdecrypt.encrypt('{"planting_no":"' + result[0].planting_no + '"}')}])
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
