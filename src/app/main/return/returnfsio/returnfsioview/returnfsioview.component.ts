import {Component, OnInit, ViewChild} from '@angular/core';
import {returnbsioheader, returnbsioline} from '../../returnbsio/returnbsioview/returnbsioviewmodel';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {returnfsioheader, returnfsioline} from './returnfsioviewmodel';

@Component({
  selector: 'app-returnfsioview',
  templateUrl: './returnfsioview.component.html',
  styleUrls: ['./returnfsioview.component.scss']
})
export class ReturnfsioviewComponent implements OnInit {

  document_no: any;
  return_fsio_header : Array<returnfsioheader> [];
  displayedColumns: string[] = ['item_no','item_name','item_class_of_seed','lot_no',
    'no_of_bags','quantity', 'unit_price', 'line_amount', 'line_discount'];

  dataSource: MatTableDataSource<returnfsioline>;
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
    this.document_no = this.route.snapshot.paramMap.get('response')
  }

  ngOnInit(): void {
    this.get_return_bsio_details();
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

  get_return_bsio_details() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.return_fsio_details + this.document_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<returnfsioline>(result[0].rbl);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.return_fsio_header = result;
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
