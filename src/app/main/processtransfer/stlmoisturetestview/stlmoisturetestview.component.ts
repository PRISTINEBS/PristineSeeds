import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {stlphysicalpuritymodel} from '../stlphysicalpuritytest/stlphysicalpuritytestmodel';
import {GotVarietyWiseQualityPlants} from '../gotfieldtests/gotfieldtestsmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {stlmoisturemodel} from '../stlmoisturetest/stlmoisturetestmodel';

@Component({
  selector: 'app-stlmoisturetestview',
  templateUrl: './stlmoisturetestview.component.html',
  styleUrls: ['./stlmoisturetestview.component.scss']
})
export class StlmoisturetestviewComponent implements OnInit {

  stl_moisture_test_no: any;
  displayedColumns: string[] = ['count1_r1_nsl','count1_r1_asl', 'count1_r1_fug','count1_r1_hs','count1_r1_ds','total'];

  dataSource: MatTableDataSource<stlmoisturemodel>;
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
    this.stl_moisture_test_no = this.route.snapshot.paramMap.get('response')
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_stl_moisture_test_no + this.stl_moisture_test_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<stlmoisturemodel>(result);
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

  get_result_item_code_On_Line(stlmoisturemodel : stlmoisturemodel){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_variety_wise_quality_parameter_with_type+
        stlmoisturemodel.item_no+'&type=Moisture Test').then(result => {
        if (result.toString() == []) {
          this._toster.warning('No Variety Quality Found For Item No '+stlmoisturemodel.item_no, 'Message');
        } else {
          if (result[0].condition.toLowerCase() === 'true') {
            console.log(this.gotvarietywisequalityplants);
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

  set_result(){
    for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
      let res : boolean = false;
      res = this.checkwithparametercalc(this.gotvarietywisequalityplants[j],this.dataSource.data[0]);
      this.dataSource.data[0].result_date = this.datePipe.transform(new Date(),'MM-dd-yyyy');
      if(res){
        this.dataSource.data[0].moisture_result = 'PASS'
      }else{
        this.dataSource.data[0].moisture_result = 'FAIL'
        this.spinner.hide();
        return;
      }
    }
  }

  checkwithparametercalc(gotvariety : GotVarietyWiseQualityPlants,stlmoisturemodel : stlmoisturemodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'vapour proof %'){
        if(stlmoisturemodel.vapour_proof_per < gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'non-vapour proof %'){
        if(stlmoisturemodel.non_vapour_proof_per < gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'vapour proof %'){
        if(stlmoisturemodel.vapour_proof_per > gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'non-vapour proof %'){
        if(stlmoisturemodel.non_vapour_proof_per > gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'vapour proof %'){
        if(stlmoisturemodel.vapour_proof_per == gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'non-vapour proof %'){
        if(stlmoisturemodel.non_vapour_proof_per == gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'vapour proof %'){
        if(stlmoisturemodel.vapour_proof_per <= gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'non-vapour proof %'){
        if(stlmoisturemodel.non_vapour_proof_per <= gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'vapour proof %'){
        if(stlmoisturemodel.vapour_proof_per >= gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'non-vapour proof %'){
        if(stlmoisturemodel.non_vapour_proof_per >= gotvariety.value){
          return true;
        }
        return false;
      }
    }
  }

  savemoisture(){
    if(this.dataSource.data[0].result_done == 1){
      this._toster.error('Moisture Result Already Been Declared', 'Error');
    }else{
      if(this.dataSource.data[0].moisture_result == '' || this.dataSource.data[0].moisture_result == null){
        this._toster.error('Please Fill Moisture Values', 'Error');
      }else{
        try {

          const json = {
            result_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }

          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_moisture_test,json).then(result => {
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

  submitmoisture(){
    if(this.dataSource.data[0].result_done == 1){
      this._toster.error('Moisture Result Already Been Declared', 'Error');
    }else{
      if(this.dataSource.data[0].moisture_result == '' || this.dataSource.data[0].moisture_result == null){
        this._toster.error('Please Fill Moisture Values', 'Error');
      }else{
        try {

          this.dataSource.data[0].result_done = 1

          const json = {
            result_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }

          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_moisture_test,json).then(result => {
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
