import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Purchaseorderlistmodel} from '../../purchaseorder/purchaseorderlist/purchaseorderlistmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {Router} from '@angular/router';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Blendinglistmodel} from './blendinglistmodel';

@Component({
  selector: 'app-blendinglist',
  templateUrl: './blendinglist.component.html',
  styleUrls: ['./blendinglist.component.scss']
})
export class BlendinglistComponent implements OnInit {

  displayedColumns: string[] = ['blending_no','status_name', 'item_no', 'item_name','new_lot_no', 'season_code', 'stage_code', 'created_on', 'Action'];
  dataSource: MatTableDataSource<Blendinglistmodel>;
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
    this.get_blending_list()
  }

  get_blending_list() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.BlendingList + this.sessionManageMent.getLocationId).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Blendinglistmodel>(result);
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
    this.router.navigateByUrl('/ordermanagement/blendingcreate');
  }


  viewinfo(e) {
    this.router.navigate(['/ordermanagement/blendingview', {response: e}]);
  }

}
