import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Purchaseorderlistmodel} from "../../ordermanagement/purchaseorder/purchaseorderlist/purchaseorderlistmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ProcessTransferHeader} from "./processtransferlistmodel";

@Component({
  selector: 'app-processtransferlist',
  templateUrl: './processtransferlist.component.html',
  styleUrls: ['./processtransferlist.component.scss']
})
export class ProcesstransferlistComponent implements OnInit {

  displayedColumns: string[] = ['process_transfer_no','from_stage', 'to_stage', 'crop_code', 'item_no', 'item_class_of_seeds', 'item_crop', 'created_by', 'created_on', 'Action'];
  dataSource: MatTableDataSource<ProcessTransferHeader>;
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
    this.get_purchase_order()
  }

  get_purchase_order() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ProcessTransferList + this.sessionManageMent.getLocationId).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<ProcessTransferHeader>(result);
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

  create_process_transfer() {
    this.router.navigateByUrl('/processtransfer/processtransfercreate');
  }


  viewinfo(e) {
    this.router.navigate(['/processtransfer/processtransferview', {response: e}]);
  }

}
