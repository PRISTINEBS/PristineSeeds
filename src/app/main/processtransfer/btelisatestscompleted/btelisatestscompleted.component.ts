import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {btelisamodel} from "../btelisatests/btelisatestsmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GotVarietyWiseQualityPlants} from "../gotfieldtests/gotfieldtestsmodel";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-btelisatestscompleted',
  templateUrl: './btelisatestscompleted.component.html',
  styleUrls: ['./btelisatestscompleted.component.scss']
})
export class BtelisatestscompletedComponent implements OnInit {

  displayedColumns: string[] = ['crop_code','item_no', 'item_name','sub_cat_name','crop_type',
    'sample_code','stage_code','arrival_qty','total_test_sample','positive_for_cry_1ac','positive_for_cry_2ab',
    'positive_for_cry_1ac_per','positive_for_cry_2ab_per','result','date_of_testing'];
  dataSource: MatTableDataSource<btelisamodel> = null;
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
    this.bt_elisa_completed_test();
  }

  bt_elisa_completed_test() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.completed_bt_elisa_test).then(
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
