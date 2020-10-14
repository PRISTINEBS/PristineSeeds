import {Component, OnInit} from '@angular/core';
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {HttpClient} from "@angular/common/http";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-cutomerenteraddress',
    templateUrl: './cutomerenteraddress.component.html',
    styleUrls: ['./cutomerenteraddress.component.scss']
})
export class CutomerenteraddressComponent implements OnInit {
  GeneralInformation: FormGroup;
  Address:FormGroup;
  stateList: any = [];
    constructor( private  fb: FormBuilder,
                 public  dialogref:MatDialogRef<CutomerenteraddressComponent>,
                 public sessionManageMent: SessionManageMent,
                 private httpClient: HttpClient,
                 private _encriptdecript: EncriptDecript,
                 private WebApihttp: WebApiHttp,
                 private _toster: ToastrService,) {
      this.Address = this.fb.group({
        Address: [null, Validators.required],
        PinCode:[null, [Validators.required, Validators.pattern(/^(\d{6})$/)]],
        City: [null, Validators.required],
        State: [null, Validators.required],
        Village: [null],
        Taluka: [null],
        Country: [null,Validators.required],
        AddressType: [null,Validators.required],
      })

    }

    ngOnInit(): void {
      this.httpClient.get("assets/State.json").subscribe(data => {
        this.stateList = data;
      })
    }

    onsubmit(){
      const json={
        name:this.Address.get('AddressType').value,
        address:this.Address.get('Address').value,
        pincode:this.Address.get('PinCode').value,
        city:this.Address.get('City').value,
        state:this.Address.get('State').value,
        country:this.Address.get('Country').value,
        village:this.Address.get('Village').value,
        taluka:this.Address.get('Taluka').value,
      }
      this.dialogref.close({data:json})
    }
}
