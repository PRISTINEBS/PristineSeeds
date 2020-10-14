import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Blendingviewmodel} from '../../blending/blendingview/blendingviewmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {Bulkingviewmodel} from './bulkingviewmodel';

@Component({
  selector: 'app-bulkingview',
  templateUrl: './bulkingview.component.html',
  styleUrls: ['./bulkingview.component.scss']
})
export class BulkingviewComponent implements OnInit {

  blending_no: any;
  displayedColumns: string[] = ['item_no','item_name','marketing_lot_no','new_lot_no','bincode','expiry_date','quantity','no_of_bags'];

  dataSource: MatTableDataSource<Bulkingviewmodel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private dialog: MatDialog) {
    this.blending_no = this.route.snapshot.paramMap.get('response')
  }

  ngOnInit(): void {
    this.get_blending_info();
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

  get_blending_info() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.BulkingInfo + this.blending_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Bulkingviewmodel>(result);
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

}
