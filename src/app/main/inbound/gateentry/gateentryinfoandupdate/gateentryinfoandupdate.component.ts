import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {MatTableDataSource} from '@angular/material/table';
import {Blendingviewmodel} from '../../../ordermanagement/blending/blendingview/blendingviewmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {gateentrychallan, Gateentryinfoandupdatemodel} from './gateentryinfoandupdatemodel';

@Component({
    selector: 'app-gateentryinfoandupdate',
    templateUrl: './gateentryinfoandupdate.component.html',
    styleUrls: ['./gateentryinfoandupdate.component.scss']
})
export class GateentryinfoandupdateComponent implements OnInit {

  gateentryno: any;
  displayedColumns: string[] = ['challan_no','challan_date','crop','description','quantity','no_of_bags'];

  gateentryinfoandupdatemodel: Gateentryinfoandupdatemodel[];
  dataSource: MatTableDataSource<gateentrychallan>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private dialog: MatDialog) {
    this.gateentryno = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')));
  }

  ngOnInit(): void {
    this.get_gateentry_info();
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

  get_gateentry_info() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GateEntryInfoByid + this.gateentryno.gateentryid).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<gateentrychallan>(result[0].gec);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.gateentryinfoandupdatemodel = result[0];
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
