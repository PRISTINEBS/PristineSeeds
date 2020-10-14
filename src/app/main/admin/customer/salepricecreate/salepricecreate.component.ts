import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {
  BaseUomCodeModel,
  categorymodel,
  GstGroupIdModel,
  GstHsnCodeModel,
  ItemGroupModel,
  subcategorymodel
} from "./salepricecreatemodel";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatDialog} from "@angular/material/dialog";
import {ItemWithAmountList} from "../../../outbound/deliveryorder/createdeliveryorder/createdeliveryordermodel";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-salepricecreate',
    templateUrl: './salepricecreate.component.html',
    styleUrls: ['./salepricecreate.component.scss']
})
export class SalepricecreateComponent implements OnInit {
    GeneralInformation: FormGroup;
    currentdate=new Date();
    ItemCategoryList: Array<categorymodel> = [];
    itemlist: ItemWithAmountList[];
    GetBaseUom: Array<BaseUomCodeModel> = []
    SalesType: Array<String> = ["Customer Price Group"]
    data: any;
    type: string
    searchByItemNameorNo:string='';

    constructor(private  fb: FormBuilder,
                private httpClient: HttpClient,
                private _encryptdecrypt: EncriptDecript,
                private WebApihttp: WebApiHttp,
                private _toster: ToastrService,
                private  router: Router,
                private  spinner:NgxSpinnerService,
                public sessionManageMent: SessionManageMent,
                private datePipe: DatePipe) {
        this.GeneralInformation = this.fb.group({
            SalesType: [null, Validators.required],
            ItemNo: [null, Validators.required],
            UnitOfMeasure:[null,Validators.required],
            Quantity: ['0', [Validators.required,Validators.min(1)]],
            UnitPrice: ['0',[ Validators.required,Validators.min(1)]],
            Mrp: ['0',[Validators.required,Validators.min(1)]],
            StartingDate: [null,Validators.required],
            EndDate: [null,Validators.required],
        })
    }


    ngOnInit(): void {
        this.get_uom();
    }

  get_Item() {
    try {
      this.spinner.show();
      this.WebApihttp.Get(this.WebApihttp.ApiURLArray.FindItem + this.searchByItemNameorNo).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlist = result as ItemWithAmountList[];
        } else {
          this._toster.error(result[0].message, 'Error');
        }
        this.spinner.hide();
      }).catch(e => {
        this._toster.error(e, 'Error');
        this.spinner.hide();
      })
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }
    get_uom(){
      try{
        this.WebApihttp.Get(this.WebApihttp.ApiURLArray.GetBaseUomValue).then(result=>{
          console.log(result)
          if(Array.isArray(result) && result.length){
            this.GetBaseUom=result as BaseUomCodeModel[];
          }else{
            this._toster.warning('Unit Of Measure Not found','Message')
          }
        },error=>{
          this._toster.error(error,'Error');
        })
      }catch (e) {
        this._toster.error(e,'Error');
      }
    }

    ItemCreate() {

          const  json = {
              sales_type: this.GeneralInformation.get('SalesType').value,
              item_no: this.GeneralInformation.get('ItemNo').value,
              unit_of_measure: this.GeneralInformation.get('UnitOfMeasure').value,
              minimum_quantity:this.GeneralInformation.get('Quantity').value,
              unit_price: this.GeneralInformation.get('UnitPrice').value,
              mrp: this.GeneralInformation.get('Mrp').value,
              starting_date:this.datePipe.transform(this.GeneralInformation.get('StartingDate').value.toLocaleString(), 'MM-dd-yyyy'),
              end_date:this.datePipe.transform(this.GeneralInformation.get('EndDate').value.toLocaleString(), 'MM-dd-yyyy'),
              created_by: this.sessionManageMent.getEmail,

        }

        try {
            this.WebApihttp.Post(this.WebApihttp.ApiURLArray.SalePriceCreate, json)
                .then(result => {
                    if (result.length>0 && result[0].condition.toLowerCase() == 'true') {
                        this._toster.success( result[0].message,'Message')
                        //this.router.navigate(['/admin/itemlist'])
                    } else {
                        this._toster.error( result[0].message,'Error')
                    }
                }, error => {
                    this._toster.success('success', error)
                })
        } catch (e) {
            this._toster.success('success', e)
        }

    }


}
