import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'app-createvendor',
    templateUrl: './createvendor.component.html',
    styleUrls: ['./createvendor.component.scss']
})
export class CreatevendorComponent implements OnInit {
    GeneralInformation: FormGroup;
    CommunicationDetails: FormGroup;
    ContactInformation: FormGroup;
    TaxInformation: FormGroup;
    vendorFile: Array<File> = [];
    stateList: any = [];
    urls: Array<string> = [];

    constructor(private  fb: FormBuilder,
                private httpClient: HttpClient,
                private _encriptdecript: EncriptDecript,
                private WebApihttp: WebApiHttp,
                private _toster: ToastrService,
                public sessionManageMent: SessionManageMent) {
        this.GeneralInformation = this.fb.group({
            VendorType: [null, Validators.required],
            VendorName: [null, Validators.required],
        })
        this.CommunicationDetails = this.fb.group({
            Country: [null, Validators.required],
            State: [null],
            City: [null, Validators.required],
            PinCode: [null, [Validators.required, Validators.pattern(/^(\d{6})$/)]],
            Email: [null, [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
            Mobile: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
            Phone: [null],
            Address: [null, Validators.required],
        })
        this.ContactInformation = this.fb.group({
            ContactPersonName: [null, Validators.required],
            OperationPersonName: [null, Validators.required],
            AccountPersonName: [null, Validators.required],
            WarehousePersonName: [null, Validators.required],
            PurchasePersonName: [null, Validators.required],
            ContactPersonNo: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
            OperationPersonNo: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
            AccountPersonNo: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
            WarehousePersonNo: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
            PurchasePersonNo: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],

        })
        this.TaxInformation = this.fb.group({
            GstType: [null, Validators.required],
            GstRegNo: [{
                value: '',
                disabled: true
            }, [Validators.required, Validators.pattern(/\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}[a-zA-Z\d]{1}[zZ]{1}[a-zA-Z\d]{1}/)]],
            PanNo: [null, [Validators.required, Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)]],
            HomePage: [null],
            Currency: [null, Validators.required],
        })
    }


    ngOnInit(): void {
        this.httpClient.get("assets/State.json").subscribe(data => {
            this.stateList = data;
        })
    }

    onSelectedFile(event) {
        this.urls = [];
        let files = event.target.files;
        if (files) {
            for (let file of files) {
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    this.urls.push(e.target.result);
                }
                reader.readAsDataURL(file);
            }
        }
        this.vendorFile = event.target.files;
    }

    OnRegTypeSelectionChange() {
        if (this.TaxInformation.get('GstType').value == 'Registered' || this.TaxInformation.get('GstType').value == 'Import') {
            this.TaxInformation.get('GstRegNo').enable();
        } else {
            this.TaxInformation.get('GstRegNo').disable();
        }
    }

    CreateVendor() {
        const formData = new FormData();
        formData.append('type', this.GeneralInformation.get('VendorType').value)
        formData.append('name', this.GeneralInformation.get('VendorName').value)
        formData.append('country', this.CommunicationDetails.get('Country').value)
        formData.append('state', this.CommunicationDetails.get('State').value)
        formData.append('city', this.CommunicationDetails.get('City').value)
        formData.append('pincode', this.CommunicationDetails.get('PinCode').value)
        formData.append('email', this.CommunicationDetails.get('Email').value)
        formData.append('mobile_no', this.CommunicationDetails.get('Mobile').value)
        formData.append('phone_no', this.CommunicationDetails.get('Phone').value)
        formData.append('address', this.CommunicationDetails.get('Address').value)
        formData.append('contact_person_name', this.ContactInformation.get('ContactPersonName').value)
        formData.append('oprtn_prsn_name', this.ContactInformation.get('OperationPersonName').value)
        formData.append('accnt_prsn_name', this.ContactInformation.get('AccountPersonName').value)
        formData.append('warehouse_prsn_name', this.ContactInformation.get('WarehousePersonName').value)
        formData.append('prchase_order_prsn_name', this.ContactInformation.get('PurchasePersonName').value)
        formData.append('cntct_prn_cntct_no', this.ContactInformation.get('ContactPersonNo').value)
        formData.append('oprtn_prsn_cntct_no', this.ContactInformation.get('OperationPersonNo').value)
        formData.append('accnt_prsn_cntct_no', this.ContactInformation.get('AccountPersonNo').value)
        formData.append('warehouse_prsn_cntct_no', this.ContactInformation.get('WarehousePersonNo').value)
        formData.append('prchase_order_cntct_no', this.ContactInformation.get('PurchasePersonNo').value)
        formData.append('gst_type', this.TaxInformation.get('GstType').value)
        formData.append('gst_no', this.TaxInformation.get('GstRegNo').value)
        formData.append('pan_no', this.TaxInformation.get('PanNo').value)
        formData.append('home_page', this.TaxInformation.get('HomePage').value)
        formData.append('currency', this.TaxInformation.get('Currency').value)
        formData.append('created_by', this._encriptdecript.decrypt(localStorage.getItem('ZV_SSID')))
        Array.from(this.vendorFile).forEach(f => {
            formData.append('file', f);
        });
        try {
            this.WebApihttp.PostFormData(this.WebApihttp.ApiURLArray.CreateVendor, formData).then(result => {
                console.log(result);
                if (result[0].condition.toLowerCase() == 'true') {
                    this._toster.success('success', result[0].message);
                } else {
                    this._toster.error('error', result[0].message);
                }
            }, error => {
                this._toster.error('error', error);
            })
        } catch (e) {
            this._toster.error('error', e);
        }

    }

}
