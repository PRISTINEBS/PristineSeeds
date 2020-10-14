import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {WebApiHttp} from "../../../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
    selector: 'app-temattributetypecreation',
    templateUrl: './itemattributetypecreation.component.html',
    styleUrls: ['./itemattributetypecreation.component.scss']
})
export class itemattributetypecreationComponent implements OnInit {
    itemattributetype: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<itemattributetypecreationComponent>,
        private spinner: NgxSpinnerService,
        public webApiHttp: WebApiHttp,
        public _encryptdecrypt: EncriptDecript,
        private  router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private _toasterService: ToastrService
    ) {

        this.itemattributetype = this.fb.group({
            attrcode: [null, Validators.required],
            description: [null],
            itemname: [null, Validators.required],
        })
    }


    ngOnInit(): void {
        if (this.data.flag == 'update') {
            this.itemattributetype.get("attrcode").setValue(this.data.attributeTypeData.code)
            this.itemattributetype.get("attrcode").disable()
            this.itemattributetype.get("description").setValue(this.data.attributeTypeData.description)

        }
    }

    CreateItemCategory() {
        if (this.data.flag == 'update') {
            var json = {
                attribute_no: this.data.attributeTypeData.attribute_no,
                code: this.itemattributetype.get("attrcode").value,
                description: this.itemattributetype.get("description").value,
                flag: 'update',
                created_by: '',
                updated_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID'))
            }
        } else {
            json = {
                attribute_no: 0,
                code: this.itemattributetype.get("attrcode").value,
                description: this.itemattributetype.get("description").value,
                flag: 'Insert',
                created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
                updated_by: ''
            }
        }
        try {
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemAttributeTypeCreate, json)
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
