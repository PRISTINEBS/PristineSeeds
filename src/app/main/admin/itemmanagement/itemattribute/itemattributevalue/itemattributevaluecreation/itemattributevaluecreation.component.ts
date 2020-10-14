import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {WebApiHttp} from "../../../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
    selector: 'app-itemattributecreation',
    templateUrl: './itemattributevaluecreation.component.html',
    styleUrls: ['./itemattributevaluecreation.component.scss']
})
export class itemattributevaluecreationComponent implements OnInit {
    itemattributevalue: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<itemattributevaluecreationComponent>,
        private spinner: NgxSpinnerService,
        public webApiHttp: WebApiHttp,
        public _encryptdecrypt: EncriptDecript,
        private  router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private _toasterService: ToastrService
    ) {

        this.itemattributevalue = this.fb.group({
            attrvalue: [null, Validators.required],
            description: [null],
            itemname: [null, Validators.required],
        })
    }


    ngOnInit(): void {

        if (this.data.flag == 'update') {
            this.itemattributevalue.get("attrvalue").setValue(this.data.attributeValue.value)
            this.itemattributevalue.get("attrvalue").disable()
            this.itemattributevalue.get("description").setValue(this.data.attributeValue.description)

        }
    }

    CreateAttributeValue() {
        if (this.data.flag == 'update') {
            var json = {
                attribute_type_no: this.data.id,
                attribute_value_no: this.data.attributeValue.attribute_value_no,
                value: this.itemattributevalue.get("attrvalue").value,
                description: this.itemattributevalue.get("description").value,
                flag: 'update',
                created_by: '',
                updated_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID'))
            }
        } else {
            json = {
                attribute_type_no: this.data.id,
                attribute_value_no: 0,
                value: this.itemattributevalue.get("attrvalue").value,
                description: this.itemattributevalue.get("description").value,
                flag: 'Insert',
                created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
                updated_by: ''
            }
        }
        try {
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemAttributeValueCreate, json)
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
