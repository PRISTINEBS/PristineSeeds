import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-createvendor',
    templateUrl: './viewvendor.component.html',
    styleUrls: ['./viewvendor.component.scss']
})
export class viewvendorComponent implements OnInit {
    GeneralInformation: FormGroup;
    vendorFile: Array<File> = [];
    stateList: any = [];
    urls: Array<string> = [];
    DataTableDetail: any

    constructor(private  fb: FormBuilder,
                private httpClient: HttpClient,
                private WebApihttp: WebApiHttp,
                private _toster: ToastrService,
                private _encryptdecrypt: EncriptDecript,
                private route: ActivatedRoute,
                public sessionManageMent: SessionManageMent) {
        this.GeneralInformation = this.fb.group({
            VendorType: [null, Validators.required],
            VendorName: [null, Validators.required],
            Country: [null, Validators.required],
            State: [null],
            City: [null, Validators.required],
            PinCode: [null, [Validators.required, Validators.pattern(/^(\d{6})$/)]],
            Email: [null, [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
            Mobile: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
            Phone: [null],
            Address: [null, Validators.required],
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
            GstType: [null, Validators.required],
            GstRegNo: [null, [Validators.required, Validators.pattern(/\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}[a-zA-Z\d]{1}[zZ]{1}[a-zA-Z\d]{1}/)]],
            PanNo: [null, [Validators.required, Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)]],
            HomePage: [null],
            Currency: [null, Validators.required],
        })

    }


    ngOnInit(): void {
        this.DataTableDetail = JSON.parse(this._encryptdecrypt.decrypt(this.route.snapshot.paramMap.get('response')));
        this.setDefault();
    }

    setDefault() {
        this.GeneralInformation.setValue({
            VendorType: this.DataTableDetail.vendor_type,
            VendorName: this.DataTableDetail.name,
            Country: this.DataTableDetail.country,
            State: this.DataTableDetail.state,
            City: this.DataTableDetail.city,
            PinCode: this.DataTableDetail.pincode,
            Email: this.DataTableDetail.email_id,
            Mobile: this.DataTableDetail.mobile_no,
            Phone: this.DataTableDetail.phone_no,
            Address: this.DataTableDetail.address,
            ContactPersonName: this.DataTableDetail.contact_person_name,
            OperationPersonName: this.DataTableDetail.operation_person_name,
            AccountPersonName: this.DataTableDetail.account_person_name,
            WarehousePersonName: this.DataTableDetail.warehouse_person_name,
            PurchasePersonName: this.DataTableDetail.perchase_order_person_name,
            ContactPersonNo: this.DataTableDetail.contact_person_cntct_no,
            OperationPersonNo: this.DataTableDetail.operation_person_cntct_no,
            AccountPersonNo: this.DataTableDetail.account_person_cntct_no,
            WarehousePersonNo: this.DataTableDetail.warehouse_person_cntct_no,
            PurchasePersonNo: this.DataTableDetail.perchase_order_person_cntct_no,
            GstType: this.DataTableDetail.gst_type,
            GstRegNo: this.DataTableDetail.gst_reg_no1,
            PanNo: this.DataTableDetail.pan_no,
            HomePage: this.DataTableDetail.home_page,
            Currency: this.DataTableDetail.currency

        })
    }
}
