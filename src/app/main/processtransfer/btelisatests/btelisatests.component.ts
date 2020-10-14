import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {got_field_test_update, gotassignmentmodel} from "../gotassignment/gotassignmentmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GotOffTypePlants, GotVarietyWiseQualityPlants} from "../gotfieldtests/gotfieldtestsmodel";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {btelisa_update, btelisamodel} from "./btelisatestsmodel";

@Component({
  selector: 'app-btelisatests',
  templateUrl: './btelisatests.component.html',
  styleUrls: ['./btelisatests.component.scss']
})
export class BtelisatestsComponent implements OnInit {

  displayedColumns: string[] = ['select','crop_code','item_no', 'item_name','sub_cat_name','crop_type',
    'sample_code','stage_code','arrival_qty','total_test_sample','positive_for_cry_1ac','positive_for_cry_2ab',
    'positive_for_cry_1ac_per','positive_for_cry_2ab_per','result','date_of_testing'];
  dataSource: MatTableDataSource<btelisamodel> = null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  gotvarietywisequalityplants : GotVarietyWiseQualityPlants[];

  constructor(
    public sessionManageMent: SessionManageMent,
    private webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {
    this.bt_elisa_test();
  }


  bt_elisa_test() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_bt_elisa_test).then(
        result => {
          if (result.toString() == []) {
            this._toster.warning('No Record Found', 'Message');
          } else {
            if(result[0].condition.toLowerCase() == 'true') {
              this.dataSource = new MatTableDataSource<btelisamodel>(result);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }else {
              this._toster.warning(result[0].message, 'Message');
            }
          }
          this.spinner.hide();
          return;
          //console.log(this.dataSource);
        }
      ).catch(e => {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
  }

  selectAll:boolean=false;

  checkSelect(event){
    try{
      for(let i=0;i<this.dataSource.data.length;i++){
        if(event.checked){
          this.dataSource.data[i].bt_elisa_test_done = 1;
        }else{
          this.dataSource.data[i].bt_elisa_test_done = 0;
        }
      }
    }catch (e) {
    }
  }

  checkPeticulerchckbox(event){
    let check=false;
    try{
      for(let i=0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].bt_elisa_test_done == 0)
        {
          check=true;
          break;
        }
      }
      if(!check){
        this.selectAll=true;
      }else{
        this.selectAll=false;
      }
    }catch (e) {
    }
  }

  total_test_sample_change(rowelement : any){
    if(rowelement.total_test_sample >= 0){

      rowelement.positive_for_cry_1ac_per =
        parseFloat(((rowelement.positive_for_cry_1ac * 100)
          / rowelement.total_test_sample).toFixed(2));

      rowelement.positive_for_cry_2ab_per =
        parseFloat(((rowelement.positive_for_cry_2ab * 100)
          / rowelement.total_test_sample).toFixed(2));

      this.get_result_item_code_On_Line(rowelement);

    }else{
      this._toster.error('Total Test Sample Must Be Greater Than Or Equal To Zero', 'Error');
      rowelement.total_test_sample = 0;
    }
  }

  positive_for_cry_1ac_change(rowelement : any){
    if(rowelement.positive_for_cry_1ac >= 0){

      rowelement.positive_for_cry_1ac_per =
        parseFloat(((rowelement.positive_for_cry_1ac * 100)
          / rowelement.total_test_sample).toFixed(2));

      this.get_result_item_code_On_Line(rowelement);

    }else{
      this._toster.error('Positive For Cry 1ac Must Be Greater Than Or Equal To Zero', 'Error');
      rowelement.positive_for_cry_1ac = 0;
    }
  }

  positive_for_cry_2ab_change(rowelement : any){
    if(rowelement.positive_for_cry_2ab >= 0){

      rowelement.positive_for_cry_2ab_per =
        parseFloat(((rowelement.positive_for_cry_2ab * 100)
          / rowelement.total_test_sample).toFixed(2));

      this.get_result_item_code_On_Line(rowelement);

    }else{
      this._toster.error('Positive For Cry 2ab Must Be Greater Than Or Equal To Zero', 'Error');
      rowelement.positive_for_cry_2ab = 0;
    }
  }

  get_result_item_code_On_Line(rowelement : any){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_bt_elisa_variety_wise_quality_parameter+
        rowelement.item_no).then(result => {
        if (result.toString() == []) {
          this._toster.warning('No Variety Quality Found For Item No '+rowelement.item_no, 'Message');
        } else {
          if (result[0].condition.toLowerCase() === 'true') {
            this.gotvarietywisequalityplants = result as GotVarietyWiseQualityPlants[];
            for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
              let res : boolean = false;
              res = this.checkwithparametercalc(this.gotvarietywisequalityplants[j],rowelement);
              rowelement.date_of_testing = this.datePipe.transform(new Date(),'MM-dd-yyyy');
              if(res){
                rowelement.result = 'PASS'
              }else{
                rowelement.result = 'FAIL'
                this.spinner.hide();
                return;
              }
            }
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

  checkwithparametercalc(gotvariety : GotVarietyWiseQualityPlants,btelisamodel : btelisamodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'positive for cry 1ac %'){
        if(btelisamodel.positive_for_cry_1ac_per < gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'positive for cry 2ab %'){
        if(btelisamodel.positive_for_cry_2ab_per < gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'positive for cry 1ac %'){
        if(btelisamodel.positive_for_cry_1ac_per > gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'positive for cry 2ab %'){
        if(btelisamodel.positive_for_cry_2ab_per > gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'positive for cry 1ac %'){
        if(btelisamodel.positive_for_cry_1ac_per == gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'positive for cry 2ab %'){
        if(btelisamodel.positive_for_cry_2ab_per == gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'positive for cry 1ac %'){
        if(btelisamodel.positive_for_cry_1ac_per <= gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'positive for cry 2ab %'){
        if(btelisamodel.positive_for_cry_2ab_per <= gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'positive for cry 1ac %'){
        if(btelisamodel.positive_for_cry_1ac_per >= gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'positive for cry 2ab %'){
        if(btelisamodel.positive_for_cry_2ab_per >= gotvariety.value){
          return true;
        }
        return false;
      }
    }
  }

  updatedLines : Array<btelisa_update> = new Array<btelisa_update>();

  saveGOTFieldTest(){
    try {
      this.spinner.show();
      for(let i = 0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].result != '' && this.dataSource.data[i].result != null) {
          let addlines: btelisa_update = {
            id : this.dataSource.data[i].id,
            total_test_sample : this.dataSource.data[i].total_test_sample,
            positive_for_cry_1ac : this.dataSource.data[i].positive_for_cry_1ac,
            positive_for_cry_2ab : this.dataSource.data[i].positive_for_cry_2ab,
            positive_for_cry_1ac_per : this.dataSource.data[i].positive_for_cry_1ac_per,
            positive_for_cry_2ab_per : this.dataSource.data[i].positive_for_cry_2ab_per,
            result : this.dataSource.data[i].result,
            date_of_testing : this.dataSource.data[i].date_of_testing,
            bt_elisa_test_done : 0
          }
          this.updatedLines.push(addlines);
        }
      }

      if(this.updatedLines.length<=0){
        this._toster.error('No Record Found For Saving BT/ELISA Item', 'Error');
        this.spinner.hide();
        return;
      }

      const json = {
        created_by: this.sessionManageMent.getEmail,
        lines: this.updatedLines
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_bt_elisa_test, json).then(
        result => {
          if (result[0].condition == 'True') {
            this._toster.success(result[0].message, 'Success');
            this.spinner.hide();
            this.dataSource = null;
            this.selectAll = false;
            this.ngOnInit();
          } else {
            this._toster.error(result[0].message, 'Error');
          }
          this.spinner.hide();
        }
      ).catch(error => {
        this._toster.error(error, 'Error');
        this.spinner.hide();
      })
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }

  selectedLines : Array<btelisa_update> = new Array<btelisa_update>();

  submitGOTFieldTest(){

    let check = false;
    try{
      for(let i = 0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].bt_elisa_test_done == 1){
          check = true;
          break;
        }
      }
    }catch (e) {
    }
    if(!check){
      this._toster.error('Please Select Any Row For Submitting BT/Elisa Item', 'Error');
    }else {

      try {
        this.spinner.show();
        for(let i = 0;i<this.dataSource.data.length;i++){
          if(this.dataSource.data[i].result != '' &&
            this.dataSource.data[i].result != null && this.dataSource.data[i].bt_elisa_test_done == 1) {
            let addlines: btelisa_update = {
              id : this.dataSource.data[i].id,
              total_test_sample : this.dataSource.data[i].total_test_sample,
              positive_for_cry_1ac : this.dataSource.data[i].positive_for_cry_1ac,
              positive_for_cry_2ab : this.dataSource.data[i].positive_for_cry_2ab,
              positive_for_cry_1ac_per : this.dataSource.data[i].positive_for_cry_1ac_per,
              positive_for_cry_2ab_per : this.dataSource.data[i].positive_for_cry_2ab_per,
              result : this.dataSource.data[i].result,
              date_of_testing : this.dataSource.data[i].date_of_testing,
              bt_elisa_test_done : 1
            }
            this.selectedLines.push(addlines);
          }
        }

        if(this.selectedLines.length<=0){
          this._toster.error('Result Not Declared On Selected BT/ELISA Item', 'Error');
          this.spinner.hide();
          return;
        }

        const json = {
          created_by: this.sessionManageMent.getEmail,
          lines: this.selectedLines
        }

        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_bt_elisa_test, json).then(
          result => {
            if (result[0].condition == 'True') {
              this._toster.success(result[0].message, 'Success');
              this.spinner.hide();
              this.dataSource = null;
              this.selectAll = false;
              this.ngOnInit();
            } else {
              this._toster.error(result[0].message, 'Error');
            }
            this.spinner.hide();
          }
        ).catch(error => {
          this._toster.error(error, 'Error');
          this.spinner.hide();
        })
      } catch (e) {
        this._toster.error(e, 'Error');
        this.spinner.hide();
      }

    }

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

}
