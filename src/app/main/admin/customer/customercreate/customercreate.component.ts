import {Component, OnInit} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {HttpClient} from "@angular/common/http";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CutomerenteraddressComponent} from "./cutomerenteraddress/cutomerenteraddress.component";
import {Customercreatemodel} from "./customercreatemodel";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-customercreate',
    templateUrl: './customercreate.component.html',
    styleUrls: ['./customercreate.component.scss']
})
export class CustomercreateComponent implements OnInit {
  GeneralInformation: FormGroup;
  Address:FormGroup;
  GSTType:Array<string>=["Registered","Composite","Unregistered","Import","Exempted","Sez"];
  addressData:Array<Customercreatemodel>=[]
    constructor( private  fb: FormBuilder,
                 public sessionManageMent: SessionManageMent,
                 private httpClient: HttpClient,
                 private _encriptdecript: EncriptDecript,
                 private WebApihttp: WebApiHttp,
                 private _toster: ToastrService,
                 private router: Router,
                 public dialog: MatDialog,
                 private spinner: NgxSpinnerService,) {
      this.GeneralInformation = this.fb.group({
        Name: [null, Validators.required],
        Email: [null, [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
        MobileNumber: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
        GstType: [null, Validators.required],
        GstNumber: [null,[Validators.required, Validators.pattern(/\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}[a-zA-Z\d]{1}[zZ]{1}[a-zA-Z\d]{1}/)]],
        PanNumber: [null, [Validators.required, Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)]],
      })

    }

    ngOnInit(): void {
    }


  openDialog() {
    const dialogRef = this.dialog.open(CutomerenteraddressComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result.data!='' ){
        this.addressData.push(result.data)
      }
    });
  }
  OnRegTypeSelectionChange() {
    if (this.GeneralInformation.get('GstType').value == 'Registered' || this.GeneralInformation.get('GstType').value == 'Import') {
      this.GeneralInformation.get('GstNumber').enable();
      this.GeneralInformation.get('GstNumber').setValidators([Validators.required, Validators.pattern(/\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}[a-zA-Z\d]{1}[zZ]{1}[a-zA-Z\d]{1}/)])
    } else {
      this.GeneralInformation.get('GstNumber').disable();
      this.GeneralInformation.get('GstNumber').clearValidators()
    }
  }
  create_customer(){
    const json={
      Name:this.GeneralInformation.get('Name').value,
      MobileNo:this.GeneralInformation.get('MobileNumber').value,
      PanNo:this.GeneralInformation.get('PanNumber').value,
      GSTType:this.GeneralInformation.get('GstType').value,
      GSTNo:this.GeneralInformation.get('GstNumber').value,
      EmailId:this.GeneralInformation.get('Email').value,
      Addresses:this.addressData
    }
    try {
      this.spinner.show();
      this.WebApihttp.Post(this.WebApihttp.ApiURLArray.CreateCustomer,json).then(result=>{
        if(result.length>0 && result[0].condition.toLowerCase()=='true'){
          this._toster.success(result[0].message,'Success')
          this.GeneralInformation.reset();
          this.addressData=[];
        }else{
          this._toster.success(result[0].message,'Success')
        }
      },error=>{
        this._toster.error(error,'Error')
      }).finally(()=>{
        this.spinner.hide();
      })
    }catch (e) {
      this._toster.error(e,'Error')
    }
  }
}
