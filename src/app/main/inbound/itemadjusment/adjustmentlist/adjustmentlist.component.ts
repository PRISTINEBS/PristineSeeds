import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-adjustmentlist',
  templateUrl: './adjustmentlist.component.html',
  styleUrls: ['./adjustmentlist.component.scss']
})
export class AdjustmentlistComponent implements OnInit {


  AdjustmentType = new FormControl('', Validators.required);
  displayedColumns: string[] = ['document_no', 'inventory_type', 'document_status', 'created_by', 'created_on', 'Update'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private router: Router,
              private _encriptDecript: EncriptDecript,
              private _toster: ToastrService,
              private spinner: NgxSpinnerService,
              private _bulder: FormBuilder) {
  }

  ngOnInit(): void {
    this.adjustment_list();
  }

  adjustment_list() {
    try {
      this.spinner.show();
      const json = {
        LocationId: this.sessionManageMent.getLocationId
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DocumentList, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this._toster.warning(result[0].message, 'Message');
          }
          this.spinner.hide();
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

  start_adjustment(type: string = '', element: any = '') {
    if (type == 'start') {
      this.create_adjustment(type);
    } else if (type == 'view') {
      this.router.navigate(['/inbound/adjuestmentwork', {res: this._encriptDecript.encrypt('{"action": "' + type + '","DocumentNo":"' + element.document_no + '"}')}])
    } else if (type == 'update') {
      this.router.navigate(['/inbound/adjuestmentwork', {res: this._encriptDecript.encrypt('{"action": "' + type + '","DocumentNo":"' + element.document_no + '"}')}])
    }
  }

  create_adjustment(type: string) {
    try {
      this.spinner.show();
      const json = {
        LocationId: this.sessionManageMent.getLocationId,
        EmailId: this.sessionManageMent.getEmail,
        Type: this.AdjustmentType.value
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DocumentCreate, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.router.navigate(['/inbound/adjuestmentwork', {res: this._encriptDecript.encrypt('{"action": "' + type + '","DocumentNo":"' + result[0].document_no + '"}')}])
          } else {
            this._toster.warning(result[0].message, 'Message');
          }
          this.spinner.hide();
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
}
