import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Blendinglistmodel} from '../../blending/blendinglist/blendinglistmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {Router} from '@angular/router';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Bulkinglistmodel} from './bulkinglistmodel';

@Component({
  selector: 'app-bulkinglist',
  templateUrl: './bulkinglist.component.html',
  styleUrls: ['./bulkinglist.component.scss']
})
export class BulkinglistComponent implements OnInit {

  displayedColumns: string[] = ['bulking_no','status_name', 'item_no', 'item_name', 'season', 'created_on', 'Action'];
  dataSource: MatTableDataSource<Bulkinglistmodel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private router: Router,
              private _encriptDecript: EncriptDecript,
              private _toster: ToastrService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.get_bulking_list()
  }

  get_bulking_list() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.BulkingList + this.sessionManageMent.getLocationId).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Bulkinglistmodel>(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  create_purchase_order() {
    this.router.navigateByUrl('/ordermanagement/bulkingcreate');
  }


  viewinfo(e) {
    this.router.navigate(['/ordermanagement/bulkingview', {response: e}]);
  }

}
