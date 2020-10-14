import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PurchaseorderapprovalList} from '../../purchaseorder/purchaseorderapproval/purchaseorderapprovalmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {Router} from '@angular/router';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {TlapprovaldialogComponent} from './tlapprovaldialog/tlapprovaldialog.component';

@Component({
  selector: 'app-tlseedarrivalapproval',
  templateUrl: './tlseedarrivalapproval.component.html',
  styleUrls: ['./tlseedarrivalapproval.component.scss']
})
export class TlseedarrivalapprovalComponent implements OnInit {

  dataSource: MatTableDataSource<PurchaseorderapprovalList>;
  displayedColumns: string[] = ['document_no', 'vendor_no','season', 'order_date', 'created_by', 'gst_total', 'total_amount', 'net_amount', 'View', 'Action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private router: Router,
              private _encriptDecript: EncriptDecript,
              private _toster: ToastrService,
              private spinner: NgxSpinnerService,
              private composedilog: MatDialog) {
  }

  ngOnInit(): void {
    this.po_approval_list();
  }

  po_approval_list() {
    try {
      this.spinner.show()
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.TLSeedArrivalForApporoval + this.sessionManageMent.getLocationId).then(
        result => {
          if (result[0].condition == 'True') {
            this.dataSource = new MatTableDataSource<PurchaseorderapprovalList>(result);
            this.dataSource.paginator = this.paginator
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource = new MatTableDataSource<PurchaseorderapprovalList>([]);
            this._toster.error(result[0].message, 'Error');
          }
          this.spinner.hide();
        }
      ).catch(e => {
        this._toster.error(e, 'Error');
        this.spinner.hide();
      })
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }


  openforapproval(element: any) {
    try {

      const dialog = this.composedilog.open(TlapprovaldialogComponent, {
        width: "750px",
        data: element.document_no
      });

      dialog.afterClosed().subscribe(
        data => {

          if (data != undefined && data.hasOwnProperty('Orderstatus')) {
            this.spinner.show();
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.TLSeedArrivalApporoved, data).then(
              result => {
                if (result[0].condition == 'True') {
                  this._toster.success(result[0].message, 'Success');
                  this.po_approval_list();
                } else {
                  this._toster.error(result[0].message, 'Error');
                }
                this.spinner.hide();
              }
            ).catch(e => {
              this._toster.error(e, 'Error');
              this.spinner.hide();
            })
          }
        })

    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
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


  viewinfo(document_no: any) {
    this.router.navigate(['/ordermanagement/tlseedarrivalview', {response: document_no}]);
  }
}
