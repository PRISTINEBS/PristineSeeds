import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {samplecodemodel, upload_sample_data} from "../../admin/samplecodemaster/samplecodemastermodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormControl} from "@angular/forms";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {got_assignment_update, gotassignmentmodel} from "./gotassignmentmodel";
import {GateEntryLines, LocationList} from "../../inbound/gateentry/creategateentry/creategateentry";

@Component({
  selector: 'app-gotassignment',
  templateUrl: './gotassignment.component.html',
  styleUrls: ['./gotassignment.component.scss']
})
export class GotassignmentComponent implements OnInit {

  displayedColumns: string[] = [ 'select','crop_code','item_no', 'item_name','sub_cat_name','crop_type','sample_code','stage_code'];
  dataSource: MatTableDataSource<gotassignmentmodel> = null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  locationlist: Array<any>;
  searchBylocation: string;
  location : FormControl = new FormControl();

  constructor(
    public sessionManageMent: SessionManageMent,
    private webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService
  ) {

  }

  ngOnInit(): void {
    this.got_assignment();
    this.get_location();
  }


  got_assignment() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_got_test_assignment).then(
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

  get_location() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.locationlist).then(result => {
        this.locationlist = result as LocationList[];
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
  }

  location_name: string;
  setLoctionName(loc){
    this.location_name = loc.location_name;
  }

  selectAll:boolean=false;

  checkSelect(event){
    try{
      for(let i=0;i<this.dataSource.data.length;i++){
        if(event.checked){
          this.dataSource.data[i].assignment_done = 1;
        }else{
          this.dataSource.data[i].assignment_done = 0;
        }
      }
    }catch (e) {
    }
  }

  checkPeticulerchckbox(event){
    let check=false;
    try{
      for(let i=0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].assignment_done == 0)
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

  selectedLines : Array<got_assignment_update> = new Array<got_assignment_update>();

  update_got_assignment(){

    if(this.location.value == '' || this.location.value == undefined){
      this._toster.error('Please Select Location', 'Error');
    }else{
      let check = false;
      try{
        for(let i = 0;i<this.dataSource.data.length;i++){
          if(this.dataSource.data[i].assignment_done == 1){
            check = true;
            break;
          }
        }
      }catch (e) {
      }
      if(!check){
        this._toster.error('Please Select Any Row For GOT Assignment On Location '+this.location_name, 'Error');
      }else {

        try {
          this.spinner.show();

          for(let i = 0;i<this.dataSource.data.length;i++){
            if(this.dataSource.data[i].assignment_done == 1) {
              let addlines: got_assignment_update = {
                id : this.dataSource.data[i].id,
                assignment_done : (this.dataSource.data[i].assignment_done)?1:0
              }
              this.selectedLines.push(addlines);
            }
          }

          const json = {
            location_code: this.location.value,
            assignment_by: this.sessionManageMent.getEmail,
            lines: this.selectedLines
          }

          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_got_assignment, json).then(
            result => {
              if (result[0].condition == 'True') {
                this._toster.success(result[0].message, 'Success');
                this.spinner.hide();
                this.dataSource = null;
                this.location.setValue('');
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
