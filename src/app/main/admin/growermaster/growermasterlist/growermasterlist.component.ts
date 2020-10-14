import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Partylist} from '../../partymaster/partylist/partylistmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {Router} from '@angular/router';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Gowermasterlistmodel} from './gowermasterlistmodel';

@Component({
  selector: 'app-growermasterlist',
  templateUrl: './growermasterlist.component.html',
  styleUrls: ['./growermasterlist.component.scss']
})
export class GrowermasterlistComponent implements OnInit {

  displayedColumns: string[] = ['grower_no', 'name','contact_no', 'address', 'post_code', 'city', 'Edit'];
  dataSource: MatTableDataSource<Gowermasterlistmodel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

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
    this.party_list();
  }

  party_list() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.getgrowermaster).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.dataSource = new MatTableDataSource<Gowermasterlistmodel>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this._toster.warning(result[0].message, 'Message');
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

  createnewitem() {
    this.router.navigate(['/admin/growermastercreate'])
  }

  updateitem(data) {
    this.router.navigate(['/admin/growermastercreate', {
      res: this._encriptDecript.encrypt(JSON.stringify(data)),
      type: 'edit'
    }])
  }

}
