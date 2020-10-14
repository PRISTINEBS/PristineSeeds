import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ProcessTransferHeader} from '../../../processtransfer/processtransferlist/processtransferlistmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {Router} from '@angular/router';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Returnbsiolistmodel} from './returnbsiolistmodel';

@Component({
  selector: 'app-returnbsiolist',
  templateUrl: './returnbsiolist.component.html',
  styleUrls: ['./returnbsiolist.component.scss']
})
export class ReturnbsiolistComponent implements OnInit {

  displayedColumns: string[] = ['document_no','bsio_no', 'customer_no', 'order_datetime', 'order_status',
    'total_no_of_bags', 'total_quantity', 'total_amount', 'Action'];
  dataSource: MatTableDataSource<Returnbsiolistmodel>;
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
    this.get_return_bsio_list()
  }

  get_return_bsio_list() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_return_bsio_list + this.sessionManageMent.getLocationId).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Returnbsiolistmodel>(result);
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

  create_bsio_return() {
    this.router.navigateByUrl('/return/returnbsiocreate');
  }


  viewinfo(e) {
    this.router.navigate(['/return/returnbsioview', {response: e}]);
  }

}
