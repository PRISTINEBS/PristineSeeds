import {Component, OnInit} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {HttpClient} from "@angular/common/http";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import { Customerviewmodel} from "./customercviewmodel";
import {isArray} from "util";

@Component({
    selector: 'app-customerview',
    templateUrl: './customerview.component.html',
    styleUrls: ['./customerview.component.scss']
})
export class CustomerviewComponent implements OnInit {
    cust_id:string;
    CustomerInfo:Array<Customerviewmodel>=[]
    constructor(public sessionManageMent: SessionManageMent,
                private _encriptdecript: EncriptDecript,
                private WebApihttp: WebApiHttp,
                private _toster: ToastrService,
                private router:ActivatedRoute,
                private spinner: NgxSpinnerService,) {
      this.cust_id=this.router.snapshot.paramMap.get('res')
    }

    ngOnInit(): void {
      this.customer_info();
    }

    customer_info(){
      try {
        this.spinner.show();
        this.WebApihttp.Get(this.WebApihttp.ApiURLArray.CustomerInfo+this.cust_id).then(result=>{
          console.log(result)
          if(Array.isArray(result) && result.length && result[0].condition.toLowerCase()=='true'){
            this.CustomerInfo=result as Customerviewmodel[];
          }else{
            this.CustomerInfo=[];
            this._toster.error('Data Not Found','error')
          }
        },error=>{
          this._toster.error(error,'error')
        }).finally(()=>{
          this.spinner.hide();
        })
      }catch (e) {
        this._toster.error(e,'error')
      }

    }
}
