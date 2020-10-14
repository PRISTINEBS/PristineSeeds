import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {gotassignmentmodel} from "../gotassignment/gotassignmentmodel";
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

@Component({
  selector: 'app-gotfieldtestscompleted',
  templateUrl: './gotfieldtestscompleted.component.html',
  styleUrls: ['./gotfieldtestscompleted.component.scss']
})
export class GotfieldtestscompletedComponent implements OnInit {

  displayedColumns: string[] = ['crop_code','item_no', 'item_name','sub_cat_name','crop_type',
    'sample_code','stage_code','arrival_qty','total_no_of_plants','total_self_plants','total_off_type_plants',
    'total_no_of_genetically_plants','genetic_pure_plants_per','self_plants_per','off_type_plants_per',
    'result','date_of_result_declared','got_off_type_plant_code','got_off_type_plant_description'];
  dataSource: MatTableDataSource<gotassignmentmodel> = null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  gotofftypeplants: GotOffTypePlants[];

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
    this.got_completed_field_test();
  }


  got_completed_field_test() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.completed_got_field_test).then(
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
