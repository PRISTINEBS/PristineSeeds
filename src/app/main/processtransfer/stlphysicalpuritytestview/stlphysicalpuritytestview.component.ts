import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {stlgerminationmodel} from "../stlgerminationtest/stlgerminationtestmodel";
import {GotVarietyWiseQualityPlants} from "../gotfieldtests/gotfieldtestsmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {stlphysicalpuritymodel} from '../stlphysicalpuritytest/stlphysicalpuritytestmodel';

@Component({
  selector: 'app-stlphysicalpuritytestview',
  templateUrl: './stlphysicalpuritytestview.component.html',
  styleUrls: ['./stlphysicalpuritytestview.component.scss']
})
export class StlphysicalpuritytestviewComponent implements OnInit {

  stl_physical_purity_test_no: any;
  displayedColumns: string[] = ['count1_r1_nsl','count1_r1_asl', 'count1_r1_fug','count1_r1_hs','count1_r1_ds','total'];

  dataSource: MatTableDataSource<stlphysicalpuritymodel>;
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
    this.stl_physical_purity_test_no = this.route.snapshot.paramMap.get('response')
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_stl_physical_purity_test_no + this.stl_physical_purity_test_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<stlphysicalpuritymodel>(result);
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

  get_result_item_code_On_Line(stlphysicalpuritymodel : stlphysicalpuritymodel){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_stl_physical_purity_variety_wise_quality_parameter+
        stlphysicalpuritymodel.item_no).then(result => {
        if (result.toString() == []) {
          this._toster.warning('No Variety Quality Found For Item No '+stlphysicalpuritymodel.item_no, 'Message');
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

  set_pure_seed_result(){
    for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
      this.checkwithparametercalc_pure_seed(this.gotvarietywisequalityplants[j],this.dataSource.data[0]);
    }
    this.set_final_result(this.dataSource.data[0]);
  }

  checkwithparametercalc_pure_seed(gotvariety : GotVarietyWiseQualityPlants,stlphysicalpuritymodel : stlphysicalpuritymodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'pure seed %'){
        if(stlphysicalpuritymodel.pure_seed_per < gotvariety.value){
          this.dataSource.data[0].pure_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].pure_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'pure seed %'){
        if(stlphysicalpuritymodel.pure_seed_per > gotvariety.value){
          this.dataSource.data[0].pure_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].pure_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'pure seed %'){
        if(stlphysicalpuritymodel.pure_seed_per == gotvariety.value){
          this.dataSource.data[0].pure_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].pure_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'pure seed %'){
        if(stlphysicalpuritymodel.pure_seed_per <= gotvariety.value){
          this.dataSource.data[0].pure_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].pure_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'pure seed %'){
        if(stlphysicalpuritymodel.pure_seed_per >= gotvariety.value){
          this.dataSource.data[0].pure_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].pure_seed_res = 'FAIL'
        return;
      }
    }
  }

  set_inert_matter_result(){
    for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
      this.checkwithparametercalc_inert_matter(this.gotvarietywisequalityplants[j],this.dataSource.data[0]);
    }
    this.set_final_result(this.dataSource.data[0]);
  }

  checkwithparametercalc_inert_matter(gotvariety : GotVarietyWiseQualityPlants,stlphysicalpuritymodel : stlphysicalpuritymodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'inert matter %'){
        if(stlphysicalpuritymodel.inert_matter_per < gotvariety.value){
          this.dataSource.data[0].inert_matter_res = 'PASS'
          return;
        }
        this.dataSource.data[0].inert_matter_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'inert matter %'){
        if(stlphysicalpuritymodel.inert_matter_per > gotvariety.value){
          this.dataSource.data[0].inert_matter_res = 'PASS'
          return;
        }
        this.dataSource.data[0].inert_matter_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'inert matter %'){
        if(stlphysicalpuritymodel.inert_matter_per == gotvariety.value){
          this.dataSource.data[0].inert_matter_res = 'PASS'
          return;
        }
        this.dataSource.data[0].inert_matter_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'inert matter %'){
        if(stlphysicalpuritymodel.inert_matter_per <= gotvariety.value){
          this.dataSource.data[0].inert_matter_res = 'PASS'
          return;
        }
        this.dataSource.data[0].inert_matter_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'inert matter %'){
        if(stlphysicalpuritymodel.inert_matter_per >= gotvariety.value){
          this.dataSource.data[0].inert_matter_res = 'PASS'
          return;
        }
        this.dataSource.data[0].inert_matter_res = 'FAIL'
        return;
      }
    }
  }

  set_cut_seed_result(){
    for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
      this.checkwithparametercalc_cut_seed(this.gotvarietywisequalityplants[j],this.dataSource.data[0]);
    }
    this.set_final_result(this.dataSource.data[0]);
  }

  checkwithparametercalc_cut_seed(gotvariety : GotVarietyWiseQualityPlants,stlphysicalpuritymodel : stlphysicalpuritymodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'cut seed %'){
        if(stlphysicalpuritymodel.cut_seed_per < gotvariety.value){
          this.dataSource.data[0].cut_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].cut_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'cut seed %'){
        if(stlphysicalpuritymodel.cut_seed_per > gotvariety.value){
          this.dataSource.data[0].cut_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].cut_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'cut seed %'){
        if(stlphysicalpuritymodel.cut_seed_per == gotvariety.value){
          this.dataSource.data[0].cut_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].cut_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'cut seed %'){
        if(stlphysicalpuritymodel.cut_seed_per <= gotvariety.value){
          this.dataSource.data[0].cut_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].cut_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'cut seed %'){
        if(stlphysicalpuritymodel.cut_seed_per >= gotvariety.value){
          this.dataSource.data[0].cut_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].cut_seed_res = 'FAIL'
        return;
      }
    }
  }

  set_other_crop_seed_result(){
    for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
      this.checkwithparametercalc_other_crop_seed(this.gotvarietywisequalityplants[j],this.dataSource.data[0]);
    }
    this.set_final_result(this.dataSource.data[0]);
  }

  checkwithparametercalc_other_crop_seed(gotvariety : GotVarietyWiseQualityPlants,stlphysicalpuritymodel : stlphysicalpuritymodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'other crop seed'){
        if(stlphysicalpuritymodel.other_crop_seed_per < gotvariety.value){
          this.dataSource.data[0].other_crop_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_crop_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'other crop seed'){
        if(stlphysicalpuritymodel.other_crop_seed_per > gotvariety.value){
          this.dataSource.data[0].other_crop_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_crop_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'other crop seed'){
        if(stlphysicalpuritymodel.other_crop_seed_per == gotvariety.value){
          this.dataSource.data[0].other_crop_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_crop_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'other crop seed'){
        if(stlphysicalpuritymodel.other_crop_seed_per <= gotvariety.value){
          this.dataSource.data[0].other_crop_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_crop_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'other crop seed'){
        if(stlphysicalpuritymodel.other_crop_seed_per >= gotvariety.value){
          this.dataSource.data[0].other_crop_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_crop_seed_res = 'FAIL'
        return;
      }
    }
  }

  set_objectional_weed_seed_result(){
    for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
      this.checkwithparametercalc_objectional_weed_seed(this.gotvarietywisequalityplants[j],this.dataSource.data[0]);
    }
    this.set_final_result(this.dataSource.data[0]);
  }

  checkwithparametercalc_objectional_weed_seed(gotvariety : GotVarietyWiseQualityPlants,stlphysicalpuritymodel : stlphysicalpuritymodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'objectionable weed seed'){
        if(stlphysicalpuritymodel.objectional_weed_seed_per < gotvariety.value){
          this.dataSource.data[0].objectional_weed_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].objectional_weed_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'objectionable weed seed'){
        if(stlphysicalpuritymodel.objectional_weed_seed_per > gotvariety.value){
          this.dataSource.data[0].objectional_weed_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].objectional_weed_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'objectionable weed seed'){
        if(stlphysicalpuritymodel.objectional_weed_seed_per == gotvariety.value){
          this.dataSource.data[0].objectional_weed_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].objectional_weed_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'objectionable weed seed'){
        if(stlphysicalpuritymodel.objectional_weed_seed_per <= gotvariety.value){
          this.dataSource.data[0].objectional_weed_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].objectional_weed_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'objectionable weed seed'){
        if(stlphysicalpuritymodel.objectional_weed_seed_per >= gotvariety.value){
          this.dataSource.data[0].objectional_weed_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].objectional_weed_seed_res = 'FAIL'
        return;
      }
    }
  }

  set_insect_damage_result(){
    for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
      this.checkwithparametercalc_insect_damage(this.gotvarietywisequalityplants[j],this.dataSource.data[0]);
    }
    this.set_final_result(this.dataSource.data[0]);
  }

  checkwithparametercalc_insect_damage(gotvariety : GotVarietyWiseQualityPlants,stlphysicalpuritymodel : stlphysicalpuritymodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'insect damage %'){
        if(stlphysicalpuritymodel.insect_damage_per < gotvariety.value){
          this.dataSource.data[0].insect_damage_res = 'PASS'
          return;
        }
        this.dataSource.data[0].insect_damage_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'insect damage %'){
        if(stlphysicalpuritymodel.insect_damage_per > gotvariety.value){
          this.dataSource.data[0].insect_damage_res = 'PASS'
          return;
        }
        this.dataSource.data[0].insect_damage_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'insect damage %'){
        if(stlphysicalpuritymodel.insect_damage_per == gotvariety.value){
          this.dataSource.data[0].insect_damage_res = 'PASS'
          return;
        }
        this.dataSource.data[0].insect_damage_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'insect damage %'){
        if(stlphysicalpuritymodel.insect_damage_per <= gotvariety.value){
          this.dataSource.data[0].insect_damage_res = 'PASS'
          return;
        }
        this.dataSource.data[0].insect_damage_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'insect damage %'){
        if(stlphysicalpuritymodel.insect_damage_per >= gotvariety.value){
          this.dataSource.data[0].insect_damage_res = 'PASS'
          return;
        }
        this.dataSource.data[0].insect_damage_res = 'FAIL'
        return;
      }
    }
  }

  set_other_disting_seed_result(){
    for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
      this.checkwithparametercalc_other_disting_seed(this.gotvarietywisequalityplants[j],this.dataSource.data[0]);
    }
    this.set_final_result(this.dataSource.data[0]);
  }

  checkwithparametercalc_other_disting_seed(gotvariety : GotVarietyWiseQualityPlants,stlphysicalpuritymodel : stlphysicalpuritymodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'other disting. seed'){
        if(stlphysicalpuritymodel.other_disting_seed_per < gotvariety.value){
          this.dataSource.data[0].other_disting_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_disting_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'other disting. seed'){
        if(stlphysicalpuritymodel.other_disting_seed_per > gotvariety.value){
          this.dataSource.data[0].other_disting_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_disting_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'other disting. seed'){
        if(stlphysicalpuritymodel.other_disting_seed_per == gotvariety.value){
          this.dataSource.data[0].other_disting_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_disting_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'other disting. seed'){
        if(stlphysicalpuritymodel.other_disting_seed_per <= gotvariety.value){
          this.dataSource.data[0].other_disting_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_disting_seed_res = 'FAIL'
        return;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'other disting. seed'){
        if(stlphysicalpuritymodel.other_disting_seed_per >= gotvariety.value){
          this.dataSource.data[0].other_disting_seed_res = 'PASS'
          return;
        }
        this.dataSource.data[0].other_disting_seed_res = 'FAIL'
        return;
      }
    }
  }

  set_final_result(stlphysicalpuritymodel : stlphysicalpuritymodel){
    if(stlphysicalpuritymodel.pure_seed_per != 0 || stlphysicalpuritymodel.inert_matter_per != 0 ||
      stlphysicalpuritymodel.cut_seed_per != 0 || stlphysicalpuritymodel.other_crop_seed_per != 0 ||
      stlphysicalpuritymodel.objectional_weed_seed_per != 0 || stlphysicalpuritymodel.insect_damage_per != 0 ||
      stlphysicalpuritymodel.other_disting_seed_per != 0 ){

      stlphysicalpuritymodel.result_date = this.datePipe.transform(new Date(),'MM-dd-yyyy');

      if(stlphysicalpuritymodel.pure_seed_res == 'PASS' && stlphysicalpuritymodel.inert_matter_res == 'PASS' &&
        stlphysicalpuritymodel.cut_seed_res == 'PASS' && stlphysicalpuritymodel.other_crop_seed_res == 'PASS' &&
        stlphysicalpuritymodel.objectional_weed_seed_res == 'PASS' && stlphysicalpuritymodel.insect_damage_res == 'PASS' &&
        stlphysicalpuritymodel.other_disting_seed_res == 'PASS'){

        stlphysicalpuritymodel.final_res = 'PASS';

      }else{
        stlphysicalpuritymodel.final_res = 'FAIL';
      }

    }else{
      stlphysicalpuritymodel.final_res = '';
      stlphysicalpuritymodel.result_date = '';
    }
  }

  savephysicalpurity(){
    if(this.dataSource.data[0].result_done == 1){
      this._toster.error('Physical Purity Result Already Been Declared', 'Error');
    }else{
      if(this.dataSource.data[0].final_res == '' || this.dataSource.data[0].final_res == null){
        this._toster.error('Please Fill Physical Purity Values', 'Error');
      }else{
        try {

          const json = {
            result_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }

          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_physical_purity_test,json).then(result => {
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

  submitphysicalpurity(){
    if(this.dataSource.data[0].result_done == 1){
      this._toster.error('Physical Purity Result Already Been Declared', 'Error');
    }else{
      if(this.dataSource.data[0].final_res == '' || this.dataSource.data[0].final_res == null){
        this._toster.error('Please Fill Physical Purity Values', 'Error');
      }else{
        try {

          this.dataSource.data[0].result_done = 1

          const json = {
            result_done_by : this.sessionManageMent.getEmail,
            lines : this.dataSource.data
          }

          this.spinner.show();
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_stl_physical_purity_test,json).then(result => {
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
