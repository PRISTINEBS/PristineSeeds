import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {btelisa_update, btelisamodel} from '../btelisatests/btelisatestsmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {Router} from '@angular/router';
import {EncriptDecript} from '../../../../@pristine/process/EncriptDecript';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {qcfinal_update, qcfinaltest} from './qcfinaltestmodel';

@Component({
  selector: 'app-qcfinaltest',
  templateUrl: './qcfinaltest.component.html',
  styleUrls: ['./qcfinaltest.component.scss']
})
export class QcfinaltestComponent implements OnInit {

  displayedColumns: string[] = ['select','crop_code','item_no', 'item_name','sub_cat_name','crop_type',
    'sample_code','got_test_result','bt_elisa_result','germination_result',
    'pp_result','moisture_result','vigour_result','final_result','final_result_date','final_result_done_by'];
  dataSource: MatTableDataSource<qcfinaltest> = null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

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
    this.qc_final_test();
  }


  qc_final_test() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_qc_final_test).then(
        result => {
          if (result.toString() == []) {
            this._toster.warning('No Record Found', 'Message');
          } else {
            if(result[0].condition.toLowerCase() == 'true') {
              this.dataSource = new MatTableDataSource<qcfinaltest>(result);
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
          this.dataSource.data[i].final_result_done = 1;
        }else{
          this.dataSource.data[i].final_result_done = 0;
        }
      }
    }catch (e) {
    }
  }

  checkPeticulerchckbox(event){
    let check=false;
    try{
      for(let i=0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].final_result_done == 0)
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

  updatedLines : Array<qcfinal_update> = new Array<qcfinal_update>();

  saveQCFinalTest(){
    try {
      this.spinner.show();
      for(let i = 0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].final_result_done == 1) {

          let final_res : string = '';

          if(this.dataSource.data[i].got_test_result != null
            && this.dataSource.data[i].got_test_result != ''){
            if(this.dataSource.data[i].got_test_result.toLowerCase() == 'pass'){
              final_res = 'PASS';
            }else{
              final_res = 'FAIL';
            }

          }

          if(this.dataSource.data[i].bt_elisa_result != null
            && this.dataSource.data[i].bt_elisa_result != ''){
            if(this.dataSource.data[i].bt_elisa_result.toLowerCase() == 'pass' &&
              (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
              final_res = 'PASS';
            }else{
              final_res = 'FAIL';
            }
          }

          if(this.dataSource.data[i].germination_result != null
            && this.dataSource.data[i].germination_result != ''){
            if(this.dataSource.data[i].germination_result.toLowerCase() == 'pass' &&
              (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
              final_res = 'PASS';
            }else{
              final_res = 'FAIL';
            }
          }

          if(this.dataSource.data[i].pp_result != null
            && this.dataSource.data[i].pp_result != ''){
            if(this.dataSource.data[i].pp_result.toLowerCase() == 'pass' &&
              (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
              final_res = 'PASS';
            }else{
              final_res = 'FAIL';
            }
          }

          if(this.dataSource.data[i].moisture_result != null
            && this.dataSource.data[i].moisture_result != ''){
            if(this.dataSource.data[i].moisture_result.toLowerCase() == 'pass' &&
              (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
              final_res = 'PASS';
            }else{
              final_res = 'FAIL';
            }
          }

          if(this.dataSource.data[i].vigour_result != null
            && this.dataSource.data[i].vigour_result != ''){
            if(this.dataSource.data[i].vigour_result.toLowerCase() == 'pass' &&
              (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
              final_res = 'PASS';
            }else{
              final_res = 'FAIL';
            }
          }

          let addlines: qcfinal_update = {
            id: this.dataSource.data[i].id,
            final_result: final_res,
            final_result_date: this.datePipe.transform(new Date(),'MM-dd-yyyy'),
            final_result_done: 0
          }
          this.updatedLines.push(addlines);
        }
      }

      if(this.updatedLines.length<=0){
        this._toster.error('No Record Found For Saving QC Final Test', 'Error');
        this.spinner.hide();
        return;
      }

      const json = {
        final_result_done_by: this.sessionManageMent.getEmail,
        lines: this.updatedLines
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_qc_final_test, json).then(
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

    this.updatedLines.length = 0;

  }

  selectedLines : Array<qcfinal_update> = new Array<qcfinal_update>();

  submitQCFinalTest(){

    let check = false;
    try{
      for(let i = 0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].final_result_done == 1){
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
          if(this.dataSource.data[i].final_result_done == 1) {

            let final_res : string = '';

            if(this.dataSource.data[i].got_test_result != null
              && this.dataSource.data[i].got_test_result != ''){
              if(this.dataSource.data[i].got_test_result.toLowerCase() == 'pass'){
                final_res = 'PASS';
              }else{
                final_res = 'FAIL';
              }

            }

            if(this.dataSource.data[i].bt_elisa_result != null
              && this.dataSource.data[i].bt_elisa_result != ''){
              if(this.dataSource.data[i].bt_elisa_result.toLowerCase() == 'pass' &&
                (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
                final_res = 'PASS';
              }else{
                final_res = 'FAIL';
              }
            }

            if(this.dataSource.data[i].germination_result != null
              && this.dataSource.data[i].germination_result != ''){
              if(this.dataSource.data[i].germination_result.toLowerCase() == 'pass' &&
                (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
                final_res = 'PASS';
              }else{
                final_res = 'FAIL';
              }
            }

            if(this.dataSource.data[i].pp_result != null
              && this.dataSource.data[i].pp_result != ''){
              if(this.dataSource.data[i].pp_result.toLowerCase() == 'pass' &&
                (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
                final_res = 'PASS';
              }else{
                final_res = 'FAIL';
              }
            }

            if(this.dataSource.data[i].moisture_result != null
              && this.dataSource.data[i].moisture_result != ''){
              if(this.dataSource.data[i].moisture_result.toLowerCase() == 'pass' &&
                (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
                final_res = 'PASS';
              }else{
                final_res = 'FAIL';
              }
            }

            if(this.dataSource.data[i].vigour_result != null
              && this.dataSource.data[i].vigour_result != ''){
              if(this.dataSource.data[i].vigour_result.toLowerCase() == 'pass' &&
                (final_res.toLowerCase() == 'pass' || final_res.toLowerCase() == '' ) ){
                final_res = 'PASS';
              }else{
                final_res = 'FAIL';
              }
            }

            let addlines: qcfinal_update = {
              id : this.dataSource.data[i].id,
              final_result : final_res,
              final_result_date: this.datePipe.transform(new Date(),'MM-dd-yyyy'),
              final_result_done : 1
            }
            this.selectedLines.push(addlines);
          }
        }

        if(this.selectedLines.length<=0){
          this._toster.error('Result Not Declared On Selected QC Final Test', 'Error');
          this.spinner.hide();
          return;
        }

        const json = {
          final_result_done_by: this.sessionManageMent.getEmail,
          lines: this.selectedLines
        }

        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_qc_final_test, json).then(
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

      this.selectedLines.length = 0;

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
