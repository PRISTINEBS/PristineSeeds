import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {ItemListModel, VendorDetailModel} from "../vendorcataloguemodel";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
    selector: 'change-password-dialog',
    templateUrl: './vendorcataloguecreate.component.html',
    styleUrls: ['./vendorcataloguecreate.component.scss']
})
export class vendorcataloguecreateComponent implements OnInit {
    VendorCatalogue: FormGroup;
    vendorDetails: Array<VendorDetailModel> = [];
    ItemCode: Array<ItemListModel> = []

    constructor(
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<vendorcataloguecreateComponent>,
        private spinner: NgxSpinnerService,
        public webApiHttp: WebApiHttp,
        public _encryptdecrypt: EncriptDecript,
        private  router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private _toasterService: ToastrService
    ) {

        this.VendorCatalogue = this.fb.group({
            VendorName: [null, Validators.required],
            ItemCode: [null, Validators.required],
            Description: [null],
            VendorItemCode: [null],
            CostPerUnit: [null, Validators.required]
        })
    }


    ngOnInit(): void {
        if (this.data.flag == 'update') {
            this.VendorCatalogue.get("VendorName").setValue(this.data.catalogue.vendor_name)
            this.VendorCatalogue.get("VendorName").disable()
            this.VendorCatalogue.get("ItemCode").setValue(this.data.catalogue.item_code)
            this.VendorCatalogue.get("ItemCode").disable()
            this.VendorCatalogue.get("Description").setValue(this.data.catalogue.description)
            this.VendorCatalogue.get("VendorItemCode").setValue(this.data.catalogue.vendor_item_code)
            this.VendorCatalogue.get("VendorItemCode").disable();
            this.VendorCatalogue.get("CostPerUnit").setValue(this.data.catalogue.cost_per_unit)
        }
    }

    SearchIteminfo() {
        try {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItem + this.VendorCatalogue.get("ItemCode").value).then(result => {
                if (result[0].condition.toLowerCase() == 'true') {
                    this.ItemCode = result as ItemListModel[];
                } else {
                    this._toasterService.error('error', result[0].message)
                }
            }, err => {
                this._toasterService.error('error', err);
            })
        } catch (e) {
            this._toasterService.error('error', e);
        }
    }

    onVendorNameInsert() {
        try {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetVendorDetail + this.VendorCatalogue.get("VendorName").value).then(result => {
                if (result[0].condition.toLowerCase() == 'true') {
                    this.vendorDetails = result as VendorDetailModel[]
                } else {
                    this._toasterService.error('error', result[0].message)
                }
            }, err => {
                this._toasterService.error('error', err);
            })
        } catch (e) {
            this._toasterService.error('error', e);

        }
    }

    CreateCatalogue() {
        this.spinner.show();
        if (this.data.flag == 'insert') {
            const json = {
                vendor_no: this.VendorCatalogue.get("VendorName").value,
                item_code: this.VendorCatalogue.get("ItemCode").value,
                vendor_item_code: this.VendorCatalogue.get("VendorItemCode").value,
                cost_per_unit: this.VendorCatalogue.get("CostPerUnit").value,
                description: this.VendorCatalogue.get("Description").value,
                created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
                flag: 'Insert'
            }
            try {
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.VendorCatalogueCreateUpdate, json).then(result => {
                    if (result[0].condition.toLowerCase() == 'true') {
                        this._toasterService.success('success', result[0].message)
                        this.dialogRef.close('true');
                        this.spinner.hide();
                    } else {
                        this._toasterService.error('error', result[0].message)
                        this.dialogRef.close('true');
                        this.spinner.hide();
                    }
                }, error => {
                    this._toasterService.error('error', error);
                    this.spinner.hide();
                })
            } catch (e) {
                this._toasterService.error('error', e)
                this.spinner.hide();
            }
        } else if (this.data.flag = 'update') {
            const json = {
                vendor_no: this.VendorCatalogue.get("VendorName").value,
                item_code: this.VendorCatalogue.get("ItemCode").value,
                vendor_item_code: this.VendorCatalogue.get("VendorItemCode").value,
                cost_per_unit: this.VendorCatalogue.get("CostPerUnit").value,
                description: this.VendorCatalogue.get("Description").value,
                update_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
                flag: 'Update'
            }
            try {
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.VendorCatalogueCreateUpdate, json).then(result => {
                    if (result[0].condition.toLowerCase() == 'true') {
                        this._toasterService.success('success', result[0].message)
                        this.dialogRef.close('true');
                        this.spinner.hide();
                    } else {
                        this._toasterService.error('error', result[0].message)
                        this.dialogRef.close('true');
                        this.spinner.hide();
                    }
                }, error => {
                    this._toasterService.error('error', error);
                    this.spinner.hide();
                })
            } catch (e) {
                this._toasterService.error('error', e)
                this.spinner.hide();
            }
        }
    }

    cancle() {
        this.dialogRef.close('true')
    }


}
