import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Purchaseorderviewmodel} from '../../purchaseorder/purchaseorderview/purchaseorderviewmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {PurchasependinggrnquantityComponent} from '../../purchaseorder/purchaseorderview/purchasependinggrnqunatity/purchasependinggrnquantity.component';
import {PurchasegrnbarcodeComponent} from '../../purchaseorder/purchaseorderview/purchasegrnbarcode/purchasegrnbarcode.component';
import {TlseedarrivalpendinggrnqunatityComponent} from './tlseedarrivalpendinggrnqunatity/tlseedarrivalpendinggrnqunatity.component';
import {TlseedarrivalpendinggrnbarcodeComponent} from './tlseedarrivalpendinggrnbarcode/tlseedarrivalpendinggrnbarcode.component';
import {Tlseedarrivalviewmodel} from './tlseedarrivalviewmodel';

@Component({
  selector: 'app-tlseedarrivalview',
  templateUrl: './tlseedarrivalview.component.html',
  styleUrls: ['./tlseedarrivalview.component.scss']
})
export class TlseedarrivalviewComponent implements OnInit {

  purchase_no: any;
  order: Array<any>;
  displayedColumns: string[] = ['production_lot_no','item_no','stage','lot_no','no_of_bags','pending_no_of_bags','applied_no_of_bags', 'quantity','pending_grn_quantity', 'received_quantity', 'accepted_quantity', 'rejected_quantity', 'mrp', 'amount', 'discount', 'gst_percentage',
    'gst_amount', 'net_amount', 'total_amount'];

  grndisplayedColumns: string[] = ['grn_no', 'grn_status','accpeted_qty', 'rejected_qty', 'grn_created_by', 'grn_created_datetime', 'external_document_no', 'external_document_date',
    'grn_completed_by', 'grn_completed_datetime'];

  dataSource: MatTableDataSource<Tlseedarrivalviewmodel>;
  grndataSource: MatTableDataSource<any>;
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
    this.purchase_no = this.route.snapshot.paramMap.get('response')
  }

  ngOnInit(): void {
    if (this.sessionManageMent.getGateEntryRequired == '1' && !this.grndisplayedColumns.includes('gate_entry_no')) {
      this.grndisplayedColumns.splice(1, 0, 'gate_entry_no');
    }

    this.get_purchase_order_info();
    this.get_purchase_order_grn_info();
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

  get_purchase_order_info() {
    try {
      this.spinner.show();
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.TLInfo, {TLSeedArrivalNo: this.purchase_no}).then(result => {
        if (result[0].condition == 'True') {
          this.dataSource = new MatTableDataSource<Tlseedarrivalviewmodel>(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.order = result;
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

  get_purchase_order_grn_info() {
    try {
      this.spinner.show();
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.TLGRNInfo, {TLSeedArrivalNo: this.purchase_no}).then(result => {
        if (result[0].condition == 'True') {
          this.grndataSource = new MatTableDataSource<any>(result);
          /*this.grndataSource.paginator = this.paginator;
          this.grndataSource.sort = this.sort;*/
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

  auto_grn_putaway_post(){

    const data = this.dataSource.data;
    const dialog = this.dialog.open(TlseedarrivalpendinggrnqunatityComponent, {width: '800px',data})
    dialog.afterClosed().subscribe(data=>{
      if (data==true){
        this.ngOnInit();
      }
    })
  }

  grn_item_info($event: any) {
    const data = $event.gib;
    const dialog = this.dialog.open(TlseedarrivalpendinggrnbarcodeComponent, {width: '800px', data});
  }

}
