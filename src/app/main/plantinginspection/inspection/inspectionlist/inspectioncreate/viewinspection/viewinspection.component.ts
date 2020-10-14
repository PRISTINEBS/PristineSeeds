import {Component, Inject, OnInit} from '@angular/core';
import {SessionManageMent} from '../../../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Inspectioncreatemodel} from '../inspectioncreatemodel';

@Component({
  selector: 'app-viewinspection',
  templateUrl: './viewinspection.component.html',
  styleUrls: ['./viewinspection.component.scss']
})
export class ViewinspectionComponent implements OnInit {

  inspection_create_model : Inspectioncreatemodel

  show_inspection1 : boolean = false;
  show_inspection2 : boolean = false;
  show_inspection3 : boolean = false;
  show_inspection4 : boolean = false;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              public dialogRef: MatDialogRef<ViewinspectionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private datePipe: DatePipe) {


  }

  ngOnInit(): void {

    this.inspection_create_model = this.data.row;

    if(this.inspection_create_model.category.toLowerCase() == 'cotton'){
      if(this.inspection_create_model.inspection_1 == 0) {
        this.show_inspection1 = true
      }else if(this.inspection_create_model.inspection_1 == 1 && this.inspection_create_model.inspection_2 == 0){
        this.show_inspection2 = true
      }else if(this.inspection_create_model.inspection_2 == 1 && this.inspection_create_model.inspection_3 == 0){
        this.show_inspection3 = true
      }else if(this.inspection_create_model.inspection_3 == 1 && this.inspection_create_model.inspection_4 == 0){
        this.show_inspection4 = true
      }
    }else if(this.data.row.category.toLowerCase() == 'vegetable'){

    }else if(this.data.row.category.toLowerCase() == 'field_crop'){

    }


  }

  create_inspection1(){
    this.dialogRef.close('true');
    this.router.navigate(['/plantinginspection/createinspection1',
      {res:this._encriptDecript.encrypt(JSON.stringify(this.inspection_create_model))}]);
  }

  create_inspection2(){

  }

  create_inspection3(){

  }

  create_inspection4(){

  }

}
