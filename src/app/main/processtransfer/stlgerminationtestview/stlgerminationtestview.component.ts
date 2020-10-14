import {Component, OnInit, ViewChild} from '@angular/core';
import {ProcessTransferHeader, ProcessTransferLine} from "../processtransferlist/processtransferlistmodel";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {stlgerminationmodel} from "../stlgerminationtest/stlgerminationtestmodel";
import {GotVarietyWiseQualityPlants} from "../gotfieldtests/gotfieldtestsmodel";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-stlgerminationtestview',
  templateUrl: './stlgerminationtestview.component.html',
  styleUrls: ['./stlgerminationtestview.component.scss']
})
export class StlgerminationtestviewComponent implements OnInit {

  stl_germination_test_no: any;
  displayedColumns: string[] = ['count1_r1_nsl','count1_r1_asl', 'count1_r1_fug','count1_r1_hs','count1_r1_ds','total'];

  dataSource: MatTableDataSource<stlgerminationmodel>;
  gotvarietywisequalityplants : GotVarietyWiseQualityPlants[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private dialog: MatDialog,
              private datePipe: DatePipe) {
    this.stl_germination_test_no = this.route.snapshot.paramMap.get('response')
  }

  ngOnInit(): void {
    this.get_stl_germination_info();
  }

  applyFilter(filterValue: string, keyName: string) {
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false
      }

    };
  }

  get_stl_germination_info() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_stl_germination_test_no + this.stl_germination_test_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<stlgerminationmodel>(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.get_result_item_code_On_Line(this.dataSource.data[0])
        } else {
          this._toster.info(result[0].message, 'Info')
        }
        this.spinner.hide();
      }).catch(error => {
        this._toster.error(error, 'Error')
        this.spinner.hide();
      })
    } catch (e) {
      this._toster.error(e, 'Error')
      this.spinner.show();
    }
  }

  get_result_item_code_On_Line(stlgerminationmodel : stlgerminationmodel){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_stl_germination_variety_wise_quality_parameter+
        stlgerminationmodel.item_no).then(result => {
        if (result.toString() == []) {
          this._toster.warning('No Variety Quality Found For Item No '+stlgerminationmodel.item_no, 'Message');
        } else {
          if (result[0].condition.toLowerCase() === 'true') {
            this.gotvarietywisequalityplants = result as GotVarietyWiseQualityPlants[];
          } else {
            this.gotvarietywisequalityplants = [];
            this._toster.error(result[0].message, 'Error');
          }
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

  c1_r_sum(a:number,b:number,c:number,d:number,e:number)
  {
    return parseFloat((a+b+c+d+e).toString()).toFixed(2);
  }

  c1_c_sum(a:number,b:number,c:number,d:number)
  {
    return parseFloat((a+b+c+d).toString()).toFixed(2);
  }

  c1_per_nsl(a:number,b:number,c:number,d:number)
  {
    let c1_per : number = parseFloat(parseFloat(((a+b+c+d) /4).toString()).toFixed(2));
    this.dataSource.data[0].count1_per = c1_per;
    this.set_result_count1(this.dataSource?.data[0]);
    return c1_per;
  }

  set_result_count1(stlgerminationmodel : stlgerminationmodel){
    if(stlgerminationmodel.count1_r1_nsl != 0 || stlgerminationmodel.count1_r2_nsl != 0 ||
      stlgerminationmodel.count1_r3_nsl != 0 || stlgerminationmodel.count1_r4_nsl != 0 ){
      for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
        let res : boolean = false;
        res = this.checkwithparametercalc_count1(this.gotvarietywisequalityplants[j],stlgerminationmodel);
        stlgerminationmodel.count1_result_date = this.datePipe.transform(new Date(),'MM-dd-yyyy');
        if(res){
          stlgerminationmodel.count1_result = 'PASS'
        }else{
          stlgerminationmodel.count1_result = 'FAIL'
          this.spinner.hide();
          return;
        }
      }
    }else{
      stlgerminationmodel.count1_result = '';
      stlgerminationmodel.count1_result_date = '';
    }
  }

  checkwithparametercalc_count1(gotvariety : GotVarietyWiseQualityPlants,stlgerminationmodel : stlgerminationmodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count1_per < gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count1_per > gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count1_per == gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count1_per <= gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count1_per >= gotvariety.value){
          return true;
        }
        return false;
      }
    }
  }

  savecount1(){
    if(this.dataSource.data[0].count1_done == 1){
      this._toster.error('Count 1 Result Already Been Declared', 'Error');
    }else{
      if(this.dataSource.data[0].count1_result == '' || this.dataSource.data[0].count1_result == null){
        this._toster.error('Please Fill Count 1 Values', 'Error');
      }else{
        try {

          const json = {
            count1_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }

          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_germination_count1_test,json).then(result => {
            if (result[0].condition.toLowerCase() === 'true') {
              this._toster.success(result[0].message, 'Success');
              this.ngOnInit();
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
    }
  }

  submitcount1(){
    if(this.dataSource.data[0].count1_done == 1){
      this._toster.error('Count 1 Result Already Been Declared', 'Error');
    }else{
      if(this.dataSource.data[0].count1_result == '' || this.dataSource.data[0].count1_result == null){
        this._toster.error('Please Fill Count 1 Values', 'Error');
      }else{
        try {

          this.dataSource.data[0].count1_done = 1

          const json = {
            count1_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }

          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_germination_count1_test,json).then(result => {
            if (result[0].condition.toLowerCase() === 'true') {
              this._toster.success(result[0].message, 'Success');
              this.ngOnInit();
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
    }
  }

  c2_r_sum(a:number,b:number,c:number,d:number,e:number)
  {
    return parseFloat((a+b+c+d+e).toString()).toFixed(2);
  }

  c2_c_sum(a:number,b:number,c:number,d:number)
  {
    return parseFloat((a+b+c+d).toString()).toFixed(2);
  }

  c2_per_nsl(a:number,b:number,c:number,d:number)
  {
    let c2_per : number = parseFloat(parseFloat(((a+b+c+d) /4).toString()).toFixed(2));
    this.dataSource.data[0].count2_per = c2_per;
    this.set_result_count2(this.dataSource?.data[0]);
    return c2_per;
  }

  set_result_count2(stlgerminationmodel : stlgerminationmodel){
    if(stlgerminationmodel.count2_r1_nsl != 0 || stlgerminationmodel.count2_r2_nsl != 0 ||
      stlgerminationmodel.count2_r3_nsl != 0 || stlgerminationmodel.count2_r4_nsl != 0 ){
      for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
        let res : boolean = false;
        res = this.checkwithparametercalc_count2(this.gotvarietywisequalityplants[j],stlgerminationmodel);
        stlgerminationmodel.count2_result_date = this.datePipe.transform(new Date(),'MM-dd-yyyy');
        if(res){
          stlgerminationmodel.count2_result = 'PASS'
        }else{
          stlgerminationmodel.count2_result = 'FAIL'
          this.spinner.hide();
          return;
        }
      }
    }else{
      stlgerminationmodel.count2_result = '';
      stlgerminationmodel.count2_result_date = '';
    }
  }

  checkwithparametercalc_count2(gotvariety : GotVarietyWiseQualityPlants,stlgerminationmodel : stlgerminationmodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count2_per < gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count2_per > gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count2_per == gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count2_per <= gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'normal seed lings'){
        if(stlgerminationmodel.count2_per >= gotvariety.value){
          return true;
        }
        return false;
      }
    }
  }

  savecount2(){
    if(this.dataSource.data[0].count2_done == 1){
      this._toster.error('Count 2 Result Already Been Declared', 'Error');
    }else{
      if(this.dataSource.data[0].count2_result == '' || this.dataSource.data[0].count2_result == null){
        this._toster.error('Please Fill Count 2 Values', 'Error');
      }else{
        try {

          const json = {
            count2_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }

          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_germination_count2_test,json).then(result => {
            if (result[0].condition.toLowerCase() === 'true') {
              this._toster.success(result[0].message, 'Success');
              this.ngOnInit();
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
    }
  }

  submitcount2(){
    if(this.dataSource.data[0].count2_done == 1){
      this._toster.error('Count 2 Result Already Been Declare Before', 'Error');
    }else{
      if(this.dataSource.data[0].count2_result == '' || this.dataSource.data[0].count2_result == null){
        this._toster.error('Please Fill Count 2 Values', 'Error');
      }else{
        try {

          this.dataSource.data[0].count2_done = 1

          const json = {
            count2_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }

          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_germination_count2_test,json).then(result => {
            if (result[0].condition.toLowerCase() === 'true') {
              this._toster.success(result[0].message, 'Success');
              this.ngOnInit();
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
    }
  }

}
