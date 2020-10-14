import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {item_barcode_bin_info} from '../inventory/inventorymodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {item_ledger_entry} from './itemledgerentrymodel';

@Component({
  selector: 'app-itemledgerentry',
  templateUrl: './itemledgerentry.component.html',
  styleUrls: ['./itemledgerentry.component.scss']
})
export class ItemledgerentryComponent implements OnInit {

  colitemledgerentry: string[] = ['ile_no','entry_type','document_type','order_no','document_no', 'sales_order_no',
    'item_type','crop_type', 'class_of_seed', 'class_of_variety','variant_code','season', 'main_category',
    'sub_category','item_no', 'item_name', 'item_group','production_lot_no','lot_no','no_of_bags', 'location_id',
    'quantity','invoiced_quantity', 'remaining_quantity', 'loss_type','created_by','created_on'];

  itemledgerentry: MatTableDataSource<item_ledger_entry>;

  @ViewChild('itemledgerentry_page', {static: true}) itemledgerentry_page: MatPaginator;
  @ViewChild('itemledgerentry_matsort', {static: true}) itemledgerentry_matsort: MatSort;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.get_item_ledger_entry();
  }

  get_item_ledger_entry() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.item_ledger_entry).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.itemledgerentry = new MatTableDataSource<item_ledger_entry>(result);
          this.itemledgerentry.paginator = this.itemledgerentry_page;
          this.itemledgerentry.sort = this.itemledgerentry_matsort;
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

  applyFilter_itemledgerentry(filterValue: string, keyName: string) {
    this.itemledgerentry.filter = filterValue;
    this.itemledgerentry.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false
      }

    };
  }

}
