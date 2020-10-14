import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GeographicalZone, PostCode, StateCode} from '../../../partymaster/partylist/partycreation/partycreationmodel';
import {HttpClient} from '@angular/common/http';
import {EncriptDecript} from '../../../../../../@pristine/process/EncriptDecript';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {ItemcreationService} from '../../../itemmanagement/itemlist/itemcreation/itemcreation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionManageMent} from '../../../../../../@pristine/process/SessionManageMent';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-growermastercreate',
  templateUrl: './growermastercreate.component.html',
  styleUrls: ['./growermastercreate.component.scss']
})
export class GrowermastercreateComponent implements OnInit {

  GeneralInformation: FormGroup;
  getpostcode: PostCode[]
  get_zone: GeographicalZone[]
  getstatecode: GeographicalZone[]
  getregionmaster: GeographicalZone[]
  getdistrictmaster: GeographicalZone[]
  gettalukamaster: GeographicalZone[]
  searchByPostCodeorName: string = '';
  data: any;
  type: string

  constructor(private  fb: FormBuilder,
              private httpClient: HttpClient,
              private _encryptdecrypt: EncriptDecript,
              private WebApihttp: WebApiHttp,
              private _toster: ToastrService,
              private _itemcreationservice: ItemcreationService,
              private  router: Router,
              public sessionManageMent: SessionManageMent,
              private spinner: NgxSpinnerService,
              private  route: ActivatedRoute) {
    this.GeneralInformation = this.fb.group({
      name: [null, Validators.required],
      postcode: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
      address: [null, Validators.required],
      address2: [null],
      location_zone: [null , Validators.required],
      stateCode: [null, Validators.required],
      region: [null, Validators.required],
      district: [null, Validators.required],
      taluka: [null, Validators.required],
      contact_no: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
      email_id: [null, [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      GstVendorType: [null, Validators.required],
      GstRegNo: [{
        value: '',
        disabled: true
      }, [Validators.required, Validators.pattern(/\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}[a-zA-Z\d]{1}[zZ]{1}[a-zA-Z\d]{1}/)]],

    })

  }


  ngOnInit(): void {

    this.searchByPostCodeorName = '1';
    this.get_post_code()
    this.searchByPostCodeorName = '';
    this.get_geographical_zone()

    this.type = this.route.snapshot.paramMap.get('type')
    if (this.type == 'edit') {
      this.data = JSON.parse(this._encryptdecrypt.decrypt(this.route.snapshot.paramMap.get('res')));
      this.GeneralInformation.get('name').setValue(this.data.name),
        this.GeneralInformation.get('postcode').setValue(this.data.post_code),
        this.GeneralInformation.get('city').setValue(this.data.city),
        this.GeneralInformation.get('country').setValue(this.data.country),
        this.GeneralInformation.get('address').setValue(this.data.address)
      this.GeneralInformation.get('address2').setValue(this.data.address2)
      this.GeneralInformation.get('location_zone').setValue(this.data.zone),
        this.GeneralInformation.get('country').setValue(this.data.country),
        this.GeneralInformation.get('stateCode').setValue(this.data.state_code),
        this.GeneralInformation.get('region').setValue(this.data.region_code),
        this.GeneralInformation.get('district').setValue(this.data.district_code),
        this.GeneralInformation.get('taluka').setValue(this.data.taluka_code),
        this.GeneralInformation.get('contact_no').setValue(this.data.contact_no),
        this.GeneralInformation.get('email_id').setValue(this.data.email_id),
        this.GeneralInformation.get('GstVendorType').setValue(this.data.gst_vendor_type),
        this.GeneralInformation.get('GstRegNo').setValue(this.data.gst_registration_no),

      this.searchByPostCodeorName = this.data.post_code;
      this.get_post_code()
      this.searchByPostCodeorName = '';
      this.get_geographical_state_code(this.data.zone)
      this.get_geographical_region(this.data.state_code)
      this.get_geographical_district(this.data.region_code)
      this.get_geographical_taluka(this.data.district_code)

    }
  }

  ItemCreate() {

    var json = {}

    if (this.type == 'edit') {
      json = {
        grower_no: this.data.grower_no,
        name: this.GeneralInformation.get('name').value,
        post_code: this.GeneralInformation.get('postcode').value,
        city: this.GeneralInformation.get('city').value,
        country: this.GeneralInformation.get('country').value,
        address: this.GeneralInformation.get('address').value,
        address2: this.GeneralInformation.get('address2').value,
        zone: this.GeneralInformation.get('location_zone').value,
        state_code: this.GeneralInformation.get('stateCode').value,
        region_code: this.GeneralInformation.get('region').value,
        district_code: this.GeneralInformation.get('district').value,
        taluka_code: this.GeneralInformation.get('taluka').value,
        contact_no: this.GeneralInformation.get('contact_no').value,
        email_id: this.GeneralInformation.get('email_id').value,
        gst_vendor_type: this.GeneralInformation.get('GstVendorType').value,
        gst_registration_no: this.GeneralInformation.get('GstRegNo').value,
        flag: 'update',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID'))
      }
    } else {
      json = {
        name: this.GeneralInformation.get('name').value,
        post_code: this.GeneralInformation.get('postcode').value,
        city: this.GeneralInformation.get('city').value,
        country: this.GeneralInformation.get('country').value,
        address: this.GeneralInformation.get('address').value,
        address2: this.GeneralInformation.get('address2').value,
        zone: this.GeneralInformation.get('location_zone').value,
        state_code: this.GeneralInformation.get('stateCode').value,
        region_code: this.GeneralInformation.get('region').value,
        district_code: this.GeneralInformation.get('district').value,
        taluka_code: this.GeneralInformation.get('taluka').value,
        contact_no: this.GeneralInformation.get('contact_no').value,
        email_id: this.GeneralInformation.get('email_id').value,
        gst_vendor_type: this.GeneralInformation.get('GstVendorType').value,
        gst_registration_no: this.GeneralInformation.get('GstRegNo').value,
        flag: 'insert',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID'))
      }
    }

    try {
      this.WebApihttp.Post(this.WebApihttp.ApiURLArray.GrowerCreate, json)
        .then(result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success('success', result[0].message)
            this.router.navigate(['/admin/growermasterlist'])
          } else {
            this._toster.error('error', result[0].message)
          }
        }, error => {
          this._toster.success('success', error)
        })
    } catch (e) {
      this._toster.success('success', e)
    }
  }

  setCityCountry(get_post_code) {
    this.GeneralInformation.get('city').setValue(get_post_code.city)
    this.GeneralInformation.get('city').disable()
    this.GeneralInformation.get('country').setValue(get_post_code.country)
    this.GeneralInformation.get('country').disable()
  }

  OnRegVendorTypeSelectionChange() {
    if (this.GeneralInformation.get('GstVendorType').value == 'Registered' || this.GeneralInformation.get('GstVendorType').value == 'Import') {
        this.GeneralInformation.get('GstRegNo').enable();
    } else {
      this.GeneralInformation.get('GstRegNo').disable();
    }
  }

  get_post_code() {
    try {
      if (this.searchByPostCodeorName != '' && this.searchByPostCodeorName != undefined) {
        this.spinner.show();
        this.WebApihttp.Get(this.WebApihttp.ApiURLArray.find_postcode + this.searchByPostCodeorName).then(result => {
          if (result[0].condition.toLowerCase() === 'true') {
            this.getpostcode = result as PostCode[];
          } else {
            this._toster.error(result[0].message, 'Error');
          }
          this.spinner.hide();
        }).catch(e => {
          this._toster.error(e, 'Error');
          this.spinner.hide();
        })
      }
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }

  get_geographical_zone() {
    try {
      this.WebApihttp.Get(this.WebApihttp.ApiURLArray.getgeographicalzone)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.get_zone = result as GeographicalZone[];
          } else {
            this._toster.error('error', 'Zone not found')
          }
        }, error => {
          this._toster.error('error', error)
        })
    } catch (e) {
      this._toster.error('error', e)
    }
  }

  get_geographical_region(state) {
    try {
      this.WebApihttp.Get(this.WebApihttp.ApiURLArray.get_geographicalregion+this.GeneralInformation.get('location_zone').value+'&state='+state)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.getregionmaster = result as GeographicalZone[];
          } else {
            this._toster.error('error', 'Zone not found')
          }
        }, error => {
          this._toster.error('error', error)
        })
    } catch (e) {
      this._toster.error('error', e)
    }
  }

  get_geographical_district(region) {
    try {
      this.WebApihttp.Get(this.WebApihttp.ApiURLArray.get_geographicaldistrict+
        this.GeneralInformation.get('location_zone').value+
        '&state='+this.GeneralInformation.get('stateCode').value+
        '&region='+region
      ).then(result => {
        if (Array.isArray(result) && result.length) {
          this.getdistrictmaster = result as GeographicalZone[];
        } else {
          this._toster.error('error', 'District Not Found')
        }
      }, error => {
        this._toster.error('error', error)
      })
    } catch (e) {
      this._toster.error('error', e)
    }
  }

  get_geographical_taluka(district) {
    try {
      this.WebApihttp.Get(this.WebApihttp.ApiURLArray.get_geographicaltaluka+
        this.GeneralInformation.get('location_zone').value+
        '&state='+this.GeneralInformation.get('stateCode').value+
        '&region='+this.GeneralInformation.get('region').value+
        '&district='+district
      ).then(result => {
        if (Array.isArray(result) && result.length) {
          this.gettalukamaster = result as GeographicalZone[];
        } else {
          this._toster.error('error', 'Taluka Not Found')
        }
      }, error => {
        this._toster.error('error', error)
      })
    } catch (e) {
      this._toster.error('error', e)
    }
  }

  get_geographical_state_code(zone) {
    try {
      this.WebApihttp.Get(this.WebApihttp.ApiURLArray.get_geographicalstatecode+zone)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.getstatecode = result as GeographicalZone[];
          } else {
            this._toster.error('error', 'Vendor Classification Master Not Found')
          }
        }, error => {
          this._toster.error('error', error)
        })
    } catch (e) {
      this._toster.error('error', e)
    }
  }

}
