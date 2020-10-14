import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Partylist} from "../partymaster/partylist/partylistmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {samplecodemodel, upload_sample_data} from "./samplecodemastermodel";
import {Observable} from "rxjs";
import * as XLSX from 'xlsx';
import {FormControl} from "@angular/forms";
import {VarietyqualityparametercreateComponent} from '../varietyqualityparameter/varietyqualityparameterlist/varietyqualityparametercreate/varietyqualityparametercreate.component';
import {MatDialog} from '@angular/material/dialog';
import {SamplecodemastercreateComponent} from './samplecodemastercreate/samplecodemastercreate.component';
@Component({
  selector: 'app-samplecodemaster',
  templateUrl: './samplecodemaster.component.html',
  styleUrls: ['./samplecodemaster.component.scss']
})
export class SamplecodemasterComponent implements OnInit {

  displayedColumns: string[] = ['lot_no', 'sample_code','year', 'created_on'];
  dataSource: MatTableDataSource<samplecodemodel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  file : File;
  arrayBuffer : any;
  uploadedData : upload_sample_data [];
  headerArray: string[];
  fileData: FormControl = new FormControl();

  constructor(
    public sessionManageMent: SessionManageMent,
    private webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService,
    private dialogActions: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.sample_code_master();
  }

  sample_code_master() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_sample_code_master).then(
        result => {
          if (result.toString() == []) {
            this._toster.warning('No Record Found', 'Message');
          } else {
            if(result[0].condition.toLowerCase() == 'true') {
              this.dataSource = new MatTableDataSource<samplecodemodel>(result);
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

  async incomingfile(event) {
    //this.progressbarshow = true;
    //this.progressValue = 20;
    //console.log(event)
    this.file = event.target.files[0];
    // console.log(this.file);
    if(this.file!=null) {
      if (this.file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || this.file.type == 'application/vnd.ms-excel') {
        var subscriberOfobservable = new Observable(observable => {
          try {
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
              this.arrayBuffer = fileReader.result;
              var data = new Uint8Array(this.arrayBuffer);
              var arr = [];
              for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
              var bstr = arr.join("");
              var workbook = XLSX.read(bstr, {type: "binary"});
              var first_sheet_name = workbook.SheetNames[0];
              var worksheet = workbook.Sheets[first_sheet_name];
              //console.log(XLSX.utils.sheet_to_json(worksheet, {raw: true}));
              this.uploadedData = XLSX.utils.sheet_to_json(worksheet, {raw: true});
              this.arrangeDataForUi();
            };
            fileReader.readAsArrayBuffer(this.file);

          } catch (error) {
            console.log(error);

          }
        });
        // await this.Upload();
        //this.validateUploadorNot = true;
        subscriberOfobservable.subscribe(result => {
          // console.log("result", result);

        })
      } else {
        this._toster.error('Invalid File Type','error')
      }
    }
  }

  arrangeDataForUi() {
    try {
      this.headerArray = Object.keys(this.uploadedData[0]);
      // console.log(this.headerArray);

      if(this.headerArray[0]!='lot_no')
      {
        console.log(this.headerArray);
        this._toster.error('Required Column lot_no not found!Please Upload valid excel','error')
      }
      else if(this.headerArray[1]!='sample_code')
      {
        console.log(this.headerArray);
        this._toster.error('Required Column sample_code not found!Please Upload valid excel','error')
      }
      else if(this.headerArray[2]!='year')
      {
        console.log(this.headerArray);
        this._toster.error('Required Column year not found!Please Upload valid excel','error')
      }else{

      }
    } catch (e) {
      console.log(e)
      // this.progressValue = 100;

    }
  }

  PostFileData() {

      if(this.fileData.value == undefined || this.fileData.value == null || this.fileData.value == '' ){
        this._toster.error('Please Browse File','error')
        return;
      }

      var posteddataitems: Array<upload_sample_data> = [];
      for (var i = 0; i < this.uploadedData.length; i++) {
        var json={
          lot_no:this.uploadedData[i].lot_no,
          sample_code:this.uploadedData[i].sample_code,
          year:this.uploadedData[i].year,
          created_by: this.sessionManageMent.getEmail
        };
        posteddataitems.push(json);
        // console.log(posteddataitems)
      }
      const jsonvalue={
        lines: posteddataitems
      }
      try{
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.sample_code_uploader,jsonvalue)
          .then(result=>{
            console.log(result)
            if(result.length>0 && result[0].condition.toLowerCase()=='true'){
              this.fileData.setValue('');
              this._toster.success('Success',result[0].message);
              this.ngOnInit();
            }else{
              this._toster.error(result[0].message,'error')
            }
          },err=>{console.log(err)})
      }catch (e) {
        console.log(e)
      }
  }

  OnClickNew() {
    var dialogConfig = this.dialogActions.open(SamplecodemastercreateComponent, {
      data: {flag: 'insert'},width : '600px'
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.sample_code_master();
      }
    })
  }

}
