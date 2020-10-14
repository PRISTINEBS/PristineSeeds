import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {stlphysicalpuritymodel} from '../stlphysicalpuritytest/stlphysicalpuritytestmodel';
import {GotVarietyWiseQualityPlants} from '../gotfieldtests/gotfieldtestsmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {stlvigourmodel} from '../stlvigourtest/stlvigourtestmodel';

@Component({
  selector: 'app-stlvigourtestview',
  templateUrl: './stlvigourtestview.component.html',
  styleUrls: ['./stlvigourtestview.component.scss']
})
export class StlvigourtestviewComponent implements OnInit {

  stl_vigour_test_no: any;
  vigour_form : FormGroup;
  displayedColumns: string[] = ['count1_r1_nsl','count1_r1_asl', 'count1_r1_fug','count1_r1_hs','count1_r1_ds','total'];

  dataSource: MatTableDataSource<stlvigourmodel>;
  gotvarietywisequalityplants : GotVarietyWiseQualityPlants[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  minDateexp: any;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private dialog: MatDialog,
              private datePipe: DatePipe) {
    this.stl_vigour_test_no = this.route.snapshot.paramMap.get('response')

    this.vigour_form = _formBuilder.group({
      sowing_date: ['', Validators.required],
      result: ['', Validators.required],
      vigour_per: [0, Validators.required],
      result_date: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.get_stl_vigour_info();
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

  get_stl_vigour_info() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_stl_vigour_test_no + this.stl_vigour_test_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<stlvigourmodel>(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.get_result_item_code_On_Line(this.dataSource.data[0])
          this.assignvalue();
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

  get_result_item_code_On_Line(stlvigourmodel : stlvigourmodel){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_variety_wise_quality_parameter_with_type+
        stlvigourmodel.item_no+'&type=Vigour Test').then(result => {
        if (result.toString() == []) {
          this._toster.warning('No Variety Quality Found For Item No '+stlvigourmodel.item_no, 'Message');
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

  set_sowing_date(){
    this.dataSource.data[0].sowing_date = this.datePipe.transform(this.vigour_form.get('sowing_date').value,'MM-dd-yyyy');
  }

  assignvalue(){
    if(this.dataSource.data[0].sowing_date == '' || this.dataSource.data[0].sowing_date == null ){
      this.vigour_form.get('sowing_date').setValue('');
    }else{
      this.vigour_form.get('sowing_date').setValue(new Date(this.dataSource.data[0].sowing_date));
    }
    this.vigour_form.get('result').setValue(this.dataSource.data[0].vigour_result);
    this.vigour_form.get('vigour_per').setValue(this.dataSource.data[0].vigour_per);
    this.vigour_form.get('result_date').setValue(this.dataSource.data[0].result_date);
  }

  set_result(){
    this.dataSource.data[0].vigour_per = this.vigour_form.get('vigour_per').value;
    for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
      let res : boolean = false;
      res = this.checkwithparametercalc(this.gotvarietywisequalityplants[j],this.vigour_form.get('vigour_per').value);
      this.dataSource.data[0].result_date = this.datePipe.transform(new Date(),'MM-dd-yyyy');
      this.vigour_form.get('result_date').setValue(this.dataSource.data[0].result_date);
      if(res){
        this.dataSource.data[0].vigour_result = 'PASS'
        this.vigour_form.get('result').setValue('PASS')
      }else{
        this.dataSource.data[0].vigour_result = 'FAIL'
        this.vigour_form.get('result').setValue('FAIL')
        return;
      }
    }
  }

  checkwithparametercalc(gotvariety : GotVarietyWiseQualityPlants,vigour_per : number){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'vigour test'){
        if(vigour_per < gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'vigour test'){
        if(vigour_per > gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'vigour test'){
        if(vigour_per == gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'vigour test'){
        if(vigour_per <= gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'vigour test'){
        if(vigour_per >= gotvariety.value){
          return true;
        }
        return false;
      }
    }
  }

  savevigour(){
    if(this.dataSource.data[0].result_done == 1){
      this._toster.error('Vigour Result Already Been Declared', 'Error');
    }else{
      if(this.dataSource.data[0].vigour_result == '' || this.dataSource.data[0].vigour_result == null){
        this._toster.error('Please Fill Vigour Values', 'Error');
      }else if(this.dataSource.data[0].sowing_date == '' || this.dataSource.data[0].sowing_date == null){
        this._toster.error('Please Choose Sowing Date', 'Error');
      }else{
        try {

          const json = {
            result_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }
          console.log(json);
          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_vigour_test,json).then(result => {
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

  submitvigour(){
    if(this.dataSource.data[0].result_done == 1){
      this._toster.error('Vigour Result Already Been Declared', 'Error');
    }else{
      if(this.dataSource.data[0].vigour_result == '' || this.dataSource.data[0].vigour_result == null){
        this._toster.error('Please Fill Vigour Values', 'Error');
      }else if(this.dataSource.data[0].sowing_date == '' || this.dataSource.data[0].sowing_date == null){
        this._toster.error('Please Choose Sowing Date', 'Error');
      }else{
        try {

          this.dataSource.data[0].result_done = 1

          const json = {
            result_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }

          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_vigour_test,json).then(result => {
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
