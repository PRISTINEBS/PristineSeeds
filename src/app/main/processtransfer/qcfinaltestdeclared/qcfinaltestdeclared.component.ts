import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {qcfinaltest} from '../qcfinaltest/qcfinaltestmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {Router} from '@angular/router';
import {EncriptDecript} from '../../../../@pristine/process/EncriptDecript';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-qcfinaltestdeclared',
  templateUrl: './qcfinaltestdeclared.component.html',
  styleUrls: ['./qcfinaltestdeclared.component.scss']
})
export class QcfinaltestdeclaredComponent implements OnInit {

  displayedColumns: string[] = ['crop_code','item_no', 'item_name','sub_cat_name','crop_type',
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_qc_final_test_completed).then(
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
