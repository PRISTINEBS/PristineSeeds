import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {got_assignment_update, got_field_test_update, gotassignmentmodel} from "../gotassignment/gotassignmentmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormControl} from "@angular/forms";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {LocationList} from "../../inbound/gateentry/creategateentry/creategateentry";
import {ItemList} from "../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel";
import {GotOffTypePlants, GotVarietyWiseQualityPlants} from "./gotfieldtestsmodel";
import DateTimeFormat = Intl.DateTimeFormat;
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-gotfieldtests',
  templateUrl: './gotfieldtests.component.html',
  styleUrls: ['./gotfieldtests.component.scss']
})
export class GotfieldtestsComponent implements OnInit {

  displayedColumns: string[] = ['select','crop_code','item_no', 'item_name','sub_cat_name','crop_type',
    'sample_code','stage_code','arrival_qty','total_no_of_plants','total_self_plants','total_off_type_plants',
    'total_no_of_genetically_plants','genetic_pure_plants_per','self_plants_per','off_type_plants_per',
    'result','date_of_result_declared','got_off_type_plant_code','got_off_type_plant_description'];
  dataSource: MatTableDataSource<gotassignmentmodel> = null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  gotofftypeplants: GotOffTypePlants[];
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
    this.get_got_off_type_plants_On_Line();
    this.got_field_test();
  }


  got_field_test() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_got_field_test).then(
        result => {
          if (result.toString() == []) {
            this._toster.warning('No Record Found', 'Message');
          } else {
            if(result[0].condition.toLowerCase() == 'true') {
              this.dataSource = new MatTableDataSource<gotassignmentmodel>(result);
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
          this.dataSource.data[i].got_test_done = 1;
        }else{
          this.dataSource.data[i].got_test_done = 0;
        }
      }
    }catch (e) {
    }
  }

  checkPeticulerchckbox(event){
    let check=false;
    try{
      for(let i=0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].got_test_done == 0)
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

  get_got_off_type_plants_On_Line(){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_got_off_type_plants).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.gotofftypeplants = result as GotOffTypePlants[];
        } else {
          this.gotofftypeplants = [];
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

  set_got_off_type_plants_on_line(rowelement : any,got_off_type_plants:any){
    rowelement.got_off_type_plant_code = got_off_type_plants.got_off_type_plant_code
    rowelement.got_off_type_plant_description = got_off_type_plants.description
  }

  total_no_of_plants_change(rowelement : any){
    if(rowelement.total_no_of_plants >= 0){
      rowelement.total_no_of_genetically_plants =
        parseFloat((rowelement.total_no_of_plants - rowelement.total_self_plants -
          rowelement.total_off_type_plants).toFixed(2))

      if (rowelement.total_no_of_genetically_plants != 0){
        rowelement.genetic_pure_plants_per =
          parseFloat(((rowelement.total_no_of_genetically_plants * 100)
          / rowelement.total_no_of_plants).toFixed(2));
      }else{
        rowelement.genetic_pure_plants_per = 0;
      }
      this.get_result_item_code_On_Line(rowelement);

    }else{
      this._toster.error('Total No Of Plants Must Be Greater Than Or Equal To Zero', 'Error');
      rowelement.total_no_of_plants = 0;
      rowelement.genetic_pure_plants_per = 0;
    }
  }

  total_self_plants_change(rowelement : any){
    if(rowelement.total_self_plants >= 0){
      rowelement.total_no_of_genetically_plants =
        parseFloat((rowelement.total_no_of_plants - rowelement.total_self_plants -
          rowelement.total_off_type_plants).toFixed(2))

      if (rowelement.total_self_plants != 0){
        rowelement.self_plants_per =
          parseFloat(((rowelement.total_self_plants * 100)
          / rowelement.total_no_of_plants).toFixed(2));
      }else{
        rowelement.self_plants_per = 0;
      }
      this.get_result_item_code_On_Line(rowelement);

    }else{
      this._toster.error('Total Self Plants Must Be Greater Than Or Equal To Zero', 'Error');
      rowelement.total_self_plants = 0;
      rowelement.self_plants_per = 0;
    }
  }

  total_off_type_plants_change(rowelement : any){
    if(rowelement.total_off_type_plants >= 0){
      rowelement.total_no_of_genetically_plants =
        parseFloat((rowelement.total_no_of_plants - rowelement.total_self_plants -
          rowelement.total_off_type_plants).toFixed(2))

      if (rowelement.total_off_type_plants != 0){
        rowelement.off_type_plants_per =
          parseFloat(((rowelement.total_off_type_plants * 100)
          / rowelement.total_no_of_plants).toFixed(2));
      }else{
        rowelement.off_type_plants_per = 0;
      }

      this.get_result_item_code_On_Line(rowelement);

    }else{
      this._toster.error('Total Off Type Plants Must Be Greater Than Or Equal To Zero', 'Error');
      rowelement.total_off_type_plants = 0;
      rowelement.off_type_plants_per = 0;
    }
  }

  get_result_item_code_On_Line(rowelement : any){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_got_variety_wise_quality_parameter+
        rowelement.item_no).then(result => {
        if (result.toString() == []) {
          this._toster.warning('No Variety Quality Found For Item No '+rowelement.item_no, 'Message');
        } else {
          if (result[0].condition.toLowerCase() === 'true') {
            this.gotvarietywisequalityplants = result as GotVarietyWiseQualityPlants[];
            for(let j = 0; j<this.gotvarietywisequalityplants.length;j++){
              let res : boolean = false;
              res = this.checkwithparametercalc(this.gotvarietywisequalityplants[j],rowelement);
              rowelement.date_of_result_declared = this.datePipe.transform(new Date(),'MM-dd-yyyy');
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

  checkwithparametercalc(gotvariety : GotVarietyWiseQualityPlants,gotassignmentmodel : gotassignmentmodel){
    if(gotvariety.parameter_value_calc.toLowerCase() == '<'){
      if(gotvariety.parameter.toLowerCase() == 'genetic pure plants %'){
        if(gotassignmentmodel.genetic_pure_plants_per < gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'self plant %'){
        if(gotassignmentmodel.self_plants_per < gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'off type plant %'){
        if(gotassignmentmodel.off_type_plants_per < gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>'){
      if(gotvariety.parameter.toLowerCase() == 'genetic pure plants %'){
        if(gotassignmentmodel.genetic_pure_plants_per > gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'self plant %'){
        if(gotassignmentmodel.self_plants_per > gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'off type plant %'){
        if(gotassignmentmodel.off_type_plants_per > gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '='){
      if(gotvariety.parameter.toLowerCase() == 'genetic pure plants %'){
        if(gotassignmentmodel.genetic_pure_plants_per == gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'self plant %'){
        if(gotassignmentmodel.self_plants_per == gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'off type plant %'){
        if(gotassignmentmodel.off_type_plants_per == gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '<='){
      if(gotvariety.parameter.toLowerCase() == 'genetic pure plants %'){
        if(gotassignmentmodel.genetic_pure_plants_per <= gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'self plant %'){
        if(gotassignmentmodel.self_plants_per <= gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'off type plant %'){
        if(gotassignmentmodel.off_type_plants_per <= gotvariety.value){
          return true;
        }
        return false;
      }
    }else if(gotvariety.parameter_value_calc.toLowerCase() == '>='){
      if(gotvariety.parameter.toLowerCase() == 'genetic pure plants %'){
        if(gotassignmentmodel.genetic_pure_plants_per >= gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'self plant %'){
        if(gotassignmentmodel.self_plants_per >= gotvariety.value){
          return true;
        }
        return false;
      }else if(gotvariety.parameter.toLowerCase() == 'off type plant %'){
        if(gotassignmentmodel.off_type_plants_per >= gotvariety.value){
          return true;
        }
        return false;
      }
    }
  }

  updatedLines : Array<got_field_test_update> = new Array<got_field_test_update>();

  saveGOTFieldTest(){
    try {
      this.spinner.show();
      for(let i = 0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].result != '' && this.dataSource.data[i].result != null) {
          let addlines: got_field_test_update = {
            id : this.dataSource.data[i].id,
            total_no_of_plants : this.dataSource.data[i].total_no_of_plants,
            total_self_plants : this.dataSource.data[i].total_self_plants,
            total_off_type_plants : this.dataSource.data[i].total_off_type_plants,
            total_no_of_genetically_plants : this.dataSource.data[i].total_no_of_genetically_plants,
            genetic_pure_plants_per : this.dataSource.data[i].genetic_pure_plants_per,
            self_plants_per : this.dataSource.data[i].self_plants_per,
            off_type_plants_per : this.dataSource.data[i].off_type_plants_per,
            result : this.dataSource.data[i].result,
            date_of_result_declared : this.dataSource.data[i].date_of_result_declared,
            got_off_type_plant_code : this.dataSource.data[i].got_off_type_plant_code,
            got_off_type_plant_description : this.dataSource.data[i].got_off_type_plant_description,
            got_test_done : 0
          }
          this.updatedLines.push(addlines);
        }
      }

      if(this.updatedLines.length<=0){
        this._toster.error('No Record Found For Saving GOT Item', 'Error');
        this.spinner.hide();
        return;
      }

      const json = {
        created_by: this.sessionManageMent.getEmail,
        lines: this.updatedLines
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_got_field_test, json).then(
        result => {
          if (result[0].condition == 'True') {
            this._toster.success(result[0].message, 'Success');
            this.spinner.hide();
            this.dataSource = null;
            this.gotofftypeplants = null;
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

  selectedLines : Array<got_field_test_update> = new Array<got_field_test_update>();

  submitGOTFieldTest(){

    let check = false;
    try{
      for(let i = 0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].got_test_done == 1){
          check = true;
          break;
        }
      }
    }catch (e) {
    }
    if(!check){
      this._toster.error('Please Select Any Row For Submitting GOT Item', 'Error');
    }else {

      try {
        this.spinner.show();
        for(let i = 0;i<this.dataSource.data.length;i++){
          if(this.dataSource.data[i].result != '' &&
            this.dataSource.data[i].result != null && this.dataSource.data[i].got_test_done == 1) {
            let addlines: got_field_test_update = {
              id : this.dataSource.data[i].id,
              total_no_of_plants : this.dataSource.data[i].total_no_of_plants,
              total_self_plants : this.dataSource.data[i].total_self_plants,
              total_off_type_plants : this.dataSource.data[i].total_off_type_plants,
              total_no_of_genetically_plants : this.dataSource.data[i].total_no_of_genetically_plants,
              genetic_pure_plants_per : this.dataSource.data[i].genetic_pure_plants_per,
              self_plants_per : this.dataSource.data[i].self_plants_per,
              off_type_plants_per : this.dataSource.data[i].off_type_plants_per,
              result : this.dataSource.data[i].result,
              date_of_result_declared : this.dataSource.data[i].date_of_result_declared,
              got_off_type_plant_code : this.dataSource.data[i].got_off_type_plant_code,
              got_off_type_plant_description : this.dataSource.data[i].got_off_type_plant_description,
              got_test_done : 1
            }
            this.selectedLines.push(addlines);
          }
        }

        if(this.selectedLines.length<=0){
          this._toster.error('Result Not Declared On Selected Got Item', 'Error');
          this.spinner.hide();
          return;
        }

        const json = {
          created_by: this.sessionManageMent.getEmail,
          lines: this.selectedLines
        }

        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_got_field_test, json).then(
          result => {
            if (result[0].condition == 'True') {
              this._toster.success(result[0].message, 'Success');
              this.spinner.hide();
              this.dataSource = null;
              this.gotofftypeplants = null;
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
