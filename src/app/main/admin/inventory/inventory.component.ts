import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Purchaseorderviewmodel} from '../../ordermanagement/purchaseorder/purchaseorderview/purchaseorderviewmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {item_barcode_bin_info, item_bin_inventory, item_inventory_by_location} from './inventorymodel';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  colitembarcodebininfo: string[] = ['item_no','lot_no','barcode','bincode','stage', 'season','location_name',
    'quantity', 'reserved_quantity', 'expiry_date'];

  colitembininventory: string[] = ['item_no', 'lot_no','bincode', 'stage', 'season', 'location_name',
    'quantity', 'quantity_to_take', 'pick_reservation', 'expiry_date', 'bin_type'];

  coliteminventorylocation: string[] = ['item_no', 'stage', 'season', 'location_name',
    'good_inventory', 'bad_inventory', 'quantity_to_take', 'reservation_quantity'];

  itembarcodebininfo: MatTableDataSource<item_barcode_bin_info>;
  itembininventory: MatTableDataSource<item_bin_inventory>;
  iteminventorylocation: MatTableDataSource<item_inventory_by_location>;

  @ViewChild('itembarcodebininfo_page', {static: true}) itembarcodebininfo_page: MatPaginator;
  @ViewChild('itembarcodebininfo_matsort', {static: true}) itembarcodebininfo_matsort: MatSort;

  @ViewChild('itembininventory_page', {static: true}) itembininventory_page: MatPaginator;
  @ViewChild('itembininventory_matsort', {static: true}) itembininventory_matsort: MatSort;

  @ViewChild('iteminventorylocation_page', {static: true}) iteminventorylocation_page: MatPaginator;
  @ViewChild('iteminventorylocation_matsort', {static: true}) iteminventorylocation_matsort: MatSort;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.get_item_barcode_bin_info();
    this.get_item_bin_inventory();
    this.get_item_inventory_location();

  }

  get_item_barcode_bin_info() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.item_barcode_bin_info).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.itembarcodebininfo = new MatTableDataSource<item_barcode_bin_info>(result);
          this.itembarcodebininfo.paginator = this.itembarcodebininfo_page;
          this.itembarcodebininfo.sort = this.itembarcodebininfo_matsort;
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

  applyFilter_item_barcode_bin_info(filterValue: string, keyName: string) {
    this.itembarcodebininfo.filter = filterValue;
    this.itembarcodebininfo.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false
      }

    };
  }

  get_item_bin_inventory() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.item_bin_inventory).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.itembininventory = new MatTableDataSource<item_bin_inventory>(result);
          this.itembininventory.paginator = this.itembininventory_page;
          this.itembininventory.sort = this.itembininventory_matsort;
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

  applyFilter_item_bin_inventory(filterValue: string, keyName: string) {
    this.itembininventory.filter = filterValue;
    this.itembininventory.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false
      }

    };
  }

  get_item_inventory_location() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.item_inventory_by_location).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.iteminventorylocation = new MatTableDataSource<item_inventory_by_location>(result);
          this.iteminventorylocation.paginator = this.iteminventorylocation_page;
          this.iteminventorylocation.sort = this.iteminventorylocation_matsort;
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

  applyFilter_item_inventory_location(filterValue: string, keyName: string) {
    this.iteminventorylocation.filter = filterValue;
    this.iteminventorylocation.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false
      }

    };
  }

}
