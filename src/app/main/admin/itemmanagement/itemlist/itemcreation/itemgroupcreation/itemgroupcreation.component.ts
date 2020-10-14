import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {WebApiHttp} from "../../../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
    selector: 'app-itemgroupcreation',
    templateUrl: './itemgroupcreation.component.html',
    styleUrls: ['./itemgroupcreation.component.scss']
})
export class itemgroupcreationComponent implements OnInit {
    ItemGroup: FormGroup;
    GenderType: Array<String> = ["Male","Female", "Others"]
    SeedClass: Array<String> = ["Breeder","Foundation", "TL","Tissue Culture"]

    constructor(
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<itemgroupcreationComponent>,
        private spinner: NgxSpinnerService,
        public webApiHttp: WebApiHttp,
        public _encryptdecrypt: EncriptDecript,
        private  router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private _toasterService: ToastrService
    ) {

        this.ItemGroup = this.fb.group({
          item_code: [null, Validators.required],
          gen: [null, Validators.required],
          seed_class: [null,Validators.required]
        })
    }


    ngOnInit(): void {
        // if (this.data.flag == 'update') {
        //     // this.itemcategory.get("seed_type").setValue(this.data.category.seed_type)
        //     // this.itemcategory.get("seed_type").disable()
        //     // this.itemcategory.get("catcode").setValue(this.data.category.code)
        //     // this.itemcategory.get("catcode").disable()
        //     // this.itemcategory.get("itemname").setValue(this.data.category.name)
        //     // this.itemcategory.get("description").setValue(this.data.category.description)
        //
        // }
    }

    CreateItemGroup() {

          const json = {
            item_no: this.ItemGroup.get("item_code").value,
            male_female: this.ItemGroup.get("gen").value,
            class_of_seed: this.ItemGroup.get("seed_class").value,
            flag:'insert',
            created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
            }

        try {
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemGroupCreation, json)
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
