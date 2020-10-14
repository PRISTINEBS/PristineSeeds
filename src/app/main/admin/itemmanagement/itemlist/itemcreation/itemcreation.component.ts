import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {
  BaseUomCodeModel,
  categorymodel,
  GstGroupIdModel,
  GstHsnCodeModel,
  ItemGroupModel,
  subcategorymodel
} from "./itemcreationmodel";
import {ItemcreationService} from "./itemcreation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {MatDialog} from "@angular/material/dialog";
import {itemgroupcreationComponent} from "./itemgroupcreation/itemgroupcreation.component";

@Component({
    selector: 'app-itemcreation',
    templateUrl: './itemcreation.component.html',
    styleUrls: ['./itemcreation.component.scss']
})
export class ItemcreationComponent implements OnInit {
    GeneralInformation: FormGroup;
    ItemCategoryList: Array<categorymodel> = []
    ItemSubcategoryList: Array<subcategorymodel> = []
    GetGstGroupId: Array<GstGroupIdModel> = []
    GetGstHsnCode: Array<GstHsnCodeModel> = []
    GetBaseUom: Array<BaseUomCodeModel> = []
    GetItemGroupList:Array<ItemGroupModel>=[]
    SeedType: Array<String> = ["Seed","Non-seed", "Consumable"]
    SeedClass: Array<String> = ["Breeder","Foundation", "TL","Tissue Culture"]
    CropType: Array<String> = ["Inbred","Hybrid", "Improved","Tissue"]
    VarietyClass: Array<String> = ["Research","Certified", "Notified","Production"]
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
                private  route: ActivatedRoute,
                private dialogActions: MatDialog) {
        this.GeneralInformation = this.fb.group({
            itemCode: [null, Validators.required],
            description: [null, Validators.required],
            Item_group:[null,Validators.required],
            baseUom: [null, Validators.required],
            seed_type: [null, Validators.required],
            // salesUom: [null, Validators.required],
            // purchaseUom: [null],
            category: [null],
            subCategory: [null],
            imageUrl: [null],
            class_of_seed: [null, Validators.required],
            fg_pack_size: [0],
            crop_type: [null, Validators.required],
            marketing_code: [null],
            class_of_variety: [null, Validators.required],
            mrp: [null, Validators.required],
            unitPrice: [null, Validators.required],
            cost: [null, Validators.required],
            gstGroup: [null, Validators.required],
            hsnCode: [null, Validators.required],
        })

        this.GetGstGroupId = this._itemcreationservice.GetGstGroupId
        this.GetBaseUom = this._itemcreationservice.GetBaseUom
    }


    ngOnInit(): void {
        this.type = this.route.snapshot.paramMap.get('type')
        this.ItemGroupList();
        if (this.type == 'edit') {
            this.data = JSON.parse(this._encryptdecrypt.decrypt(this.route.snapshot.paramMap.get('res')));
            this.getGstHsnCode(this.data.gst_group_id);
            this.seedtypechange(this.data.seed_type);
            this.getItemSubCategory(this.data.main_category_id)
            this.GeneralInformation.get('itemCode').setValue(this.data.item_no),
            this.GeneralInformation.get('itemCode').disable()
            this.GeneralInformation.get('description').setValue(this.data.description),
            // this.GeneralInformation.get('purchaseUom').setValue(this.data.purchase_unit_of_measure),
            // this.GeneralInformation.get('salesUom').setValue(this.data.sale_unit_of_measure),
            this.GeneralInformation.get('baseUom').setValue(this.data.base_unit_of_measure),
            this.GeneralInformation.get('unitPrice').setValue(this.data.unit_price),
            this.GeneralInformation.get('gstGroup').setValue(this.data.gst_group_id),
            this.GeneralInformation.get('hsnCode').setValue(this.data.hsn_code_id),
            this.GeneralInformation.get('cost').setValue(this.data.cost_per_unit),
            this.GeneralInformation.get('mrp').setValue(this.data.mrp),
            this.GeneralInformation.get('imageUrl').setValue(this.data.image_url)
            this.GeneralInformation.get('class_of_seed').setValue(this.data.class_of_seed)
            this.GeneralInformation.get('fg_pack_size').setValue(this.data.fg_pack_size)
            this.GeneralInformation.get('crop_type').setValue(this.data.crop_type)
            this.GeneralInformation.get('marketing_code').setValue(this.data.marketing_code)
            this.GeneralInformation.get('class_of_variety').setValue(this.data.class_of_variety)

            if (this.data.seed_type == 'Seed'){
              this.GeneralInformation.get('category').setValidators(Validators.required);
              this.GeneralInformation.get('subCategory').setValidators(Validators.required);
            }else{
              this.GeneralInformation.get('category').clearValidators()
              this.GeneralInformation.get('subCategory').clearValidators()
            }

        }else{
          this.GeneralInformation.get('gstGroup').setValue(0);
          this.getGstHsnCode(0);
        }
    }

    ItemGroupList(){
      try{
        this.WebApihttp.Get(this.WebApihttp.ApiURLArray.ItemGroupList).then(result=>{
          if(Array.isArray(result) && result.length){
            this.GetItemGroupList=result as ItemGroupModel[];
            if(this.type == 'edit'){
              this.GeneralInformation.get('Item_group').setValue(this.data.item_group)
            }
          }else{
            this._toster.warning('Item group not Found','Message')
          }
        },err=>{
          this._toster.error(err,'error')
        })
      }catch (e) {
        this._toster.error(e,'error')
      }
    }
    getItemSubCategory(data) {
        try {
            if(data != undefined){
              this.WebApihttp.Get(this.WebApihttp.ApiURLArray.ItemSubCategoryList + data)
                .then(result => {
                  if (Array.isArray(result) && result.length) {
                    this.ItemSubcategoryList = result as subcategorymodel[];
                    if(this.type == 'edit'){
                      this.GeneralInformation.get('subCategory').setValue(this.data.sub_category_id);
                    }
                  } else {
                    this._toster.error('error', 'Sub category not found');
                    this.GeneralInformation.get('subCategory').setValue('')
                  }
                }, error => {
                  this._toster.error('error', error)
                })
            }
        } catch (e) {
            this._toster.error('error', e)
        }
    }

    getGstHsnCode(data: any) {
        try {
            this.WebApihttp.Get(this.WebApihttp.ApiURLArray.GetGstHsnCode + data)
                .then(result => {
                    if (Array.isArray(result) && result.length) {
                        this.GetGstHsnCode = result as GstHsnCodeModel[];
                        if(this.type == 'insert' || this.type == null){
                          this.GeneralInformation.get('hsnCode').setValue(0);
                        }
                    } else {
                        this._toster.error('error', 'Hsn code not found')
                    }
                }, error => {
                    this._toster.error('error', error)
                })
        } catch (e) {
            this._toster.error('error', e)
        }
    }

    ItemCreate() {

        if(this.GeneralInformation.get('itemCode').value == null){
          this._toster.warning('Warning', 'Please Fill Item Code');
          return;
        }else if(this.GeneralInformation.get('description').value == null){
          this._toster.warning('Warning', 'Please Fill Description');
          return;
        }else if(this.GeneralInformation.get('Item_group').value == null){
          this._toster.warning('Warning', 'Please Select Item Group');
          return;
        }else if(this.GeneralInformation.get('baseUom').value == null){
          this._toster.warning('Warning', 'Please Select Base UOM');
          return;
        }else if(this.GeneralInformation.get('seed_type').value == null){
          this._toster.warning('Warning', 'Please Fill Seed Type');
          return;
        }else if(this.GeneralInformation.get('category').value == null){
          this._toster.warning('Warning', 'Please Select Category');
          return;
        }else if(this.GeneralInformation.get('subCategory').value == null){
          this._toster.warning('Warning', 'Please Select Sub category');
          return;
        }else if(this.GeneralInformation.get('class_of_seed').value == null){
          this._toster.warning('Warning', 'Please Fill Class Of Seed');
          return;
        }else if(this.GeneralInformation.get('crop_type').value == null){
          this._toster.warning('Warning', 'Please Fill Crop Type');
          return;
        }else if(this.GeneralInformation.get('class_of_variety').value == null){
          this._toster.warning('Warning', 'Please Fill Class Of Variety');
          return;
        }else if(this.GeneralInformation.get('unitPrice').value == null){
          this._toster.warning('Warning', 'Please Fill Unit Price');
          return;
        }else if(this.GeneralInformation.get('cost').value == null){
          this._toster.warning('Warning', 'Please Fill Cost/Unit');
          return;
        }else if(this.GeneralInformation.get('mrp').value == null){
          this._toster.warning('Warning', 'Please Fill MRP');
          return;
        }

        var json = {}
        if (this.type == 'edit') {
            json = {
                item_no: this.data.item_no,
                name: this.GeneralInformation.get('description').value,
                description: this.GeneralInformation.get('description').value,
                item_group:this.GeneralInformation.get('Item_group').value,
                // purchaseUom: this.GeneralInformation.get('purchaseUom').value,
                // saleUom: this.GeneralInformation.get('salesUom').value,
                base_uom: this.GeneralInformation.get('baseUom').value,
                category: this.GeneralInformation.get('category').value,
                subCategory: this.GeneralInformation.get('subCategory').value,
                unitPrice: this.GeneralInformation.get('unitPrice').value,
                gstGroupId: this.GeneralInformation.get('gstGroup').value,
                gstHsnCode: this.GeneralInformation.get('hsnCode').value,
                costPerUnit: this.GeneralInformation.get('cost').value,
                mrp: this.GeneralInformation.get('mrp').value,
                image_url: this.GeneralInformation.get('imageUrl').value,
                seed_type: this.GeneralInformation.get('seed_type').value,
                class_of_seed: this.GeneralInformation.get('class_of_seed').value,
                fg_pack_size: this.GeneralInformation.get('fg_pack_size').value,
                crop_type: this.GeneralInformation.get('crop_type').value,
                marketing_code: this.GeneralInformation.get('marketing_code').value,
                class_of_variety: this.GeneralInformation.get('class_of_variety').value,
                flag: 'update',
                created_by: '',
                updated_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
            }
        } else {
            json = {
                item_no: this.GeneralInformation.get('itemCode').value,
                name: this.GeneralInformation.get('description').value,
                description: this.GeneralInformation.get('description').value,
                item_group:this.GeneralInformation.get('Item_group').value,
                // purchaseUom: this.GeneralInformation.get('purchaseUom').value,
                // saleUom: this.GeneralInformation.get('salesUom').value,
                base_uom: this.GeneralInformation.get('baseUom').value,
                category: this.GeneralInformation.get('category').value,
                subCategory: this.GeneralInformation.get('subCategory').value,
                unitPrice: this.GeneralInformation.get('unitPrice').value,
                gstGroupId: this.GeneralInformation.get('gstGroup').value,
                gstHsnCode: this.GeneralInformation.get('hsnCode').value,
                costPerUnit: this.GeneralInformation.get('cost').value,
                mrp: this.GeneralInformation.get('mrp').value,
                image_url: this.GeneralInformation.get('imageUrl').value,
                seed_type: this.GeneralInformation.get('seed_type').value,
                class_of_seed: this.GeneralInformation.get('class_of_seed').value,
                fg_pack_size: this.GeneralInformation.get('fg_pack_size').value,
                crop_type: this.GeneralInformation.get('crop_type').value,
                marketing_code: this.GeneralInformation.get('marketing_code').value,
                class_of_variety: this.GeneralInformation.get('class_of_variety').value,
                flag: 'insert',
                created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
                updated_by: '',
            }
        }

        try {
            this.WebApihttp.Post(this.WebApihttp.ApiURLArray.ItemCreate, json)
                .then(result => {
                    if (result[0].condition.toLowerCase() == 'true') {
                        console.log(result[0])
                        this._toster.success('success', result[0].message)
                        this.router.navigate(['/admin/itemlist'])
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

  seedtypechange(get_seed_type) {

    try {
      if(get_seed_type != undefined){
        this.WebApihttp.Get(this.WebApihttp.ApiURLArray.ItemCategoryListWithSeedType + get_seed_type)
          .then(result => {
            if (Array.isArray(result) && result.length) {
              this.ItemCategoryList = result as categorymodel[];
              if(this.type == 'edit'){
                this.GeneralInformation.get('seed_type').setValue(this.data.seed_type);
                this.GeneralInformation.get('category').setValue(this.data.main_category_id);
              }
            } else {
              this._toster.error('error', 'category not found');
              this.GeneralInformation.get('category').setValue('')
            }
          }, error => {
            this._toster.error('error', error)
          })
      }
    } catch (e) {
      this._toster.error('error', e)
    }

    if (this.GeneralInformation.get('seed_type').value == 'Seed'){
      this.GeneralInformation.get('category').setValidators(Validators.required);
      this.GeneralInformation.get('subCategory').setValidators(Validators.required);
    }else{
      this.GeneralInformation.get('category').clearValidators()
      this.GeneralInformation.get('subCategory').clearValidators()
    }

  }

  ItemGroupCreate(){
      let dialogConfig=this.dialogActions.open(itemgroupcreationComponent,{
        width:'700px'
      })
    dialogConfig.afterClosed().subscribe(result=>{
      if(result=='true'){
        this.ngOnInit();
      }
    })
  }
}
