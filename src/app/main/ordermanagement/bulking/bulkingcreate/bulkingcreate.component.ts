import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Blendingcreatemodel, BlendingLine} from '../../blending/blendingcreate/blendingcreatemodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {categorymodel} from '../../../admin/itemmanagement/itemlist/itemcreation/itemcreationmodel';
import {
  BincodeLocation,
  ItemLotNoFromILEmodel,
  SeasonMastermodel
} from '../../../processtransfer/processtransfercreate/processtransfercreatemodel';
import {ItemList} from '../../purchaseorder/purchaseordercreate/purchaseordercreatemodel';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {LocationList} from '../../../inbound/gateentry/creategateentry/creategateentry';
import {Bulkingcreatemodel, BulkingLine} from './bulkingcreatemodel';

@Component({
  selector: 'app-bulkingcreate',
  templateUrl: './bulkingcreate.component.html',
  styleUrls: ['./bulkingcreate.component.scss']
})
export class BulkingcreateComponent implements OnInit {

  displayedColumns: string[] = ['item_no','item_uom', 'bincode','marketing_lot_no','new_lot_no','expiry_date','total_available_bags','total_available_qty','Action'];
  dataSource: MatTableDataSource<Bulkingcreatemodel> = null;

  @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
  @ViewChild("matSort", {static: true}) sort: MatSort;

  bulkingForm: FormGroup;
  ItemCategoryList: Array<categorymodel> = []
  seasonMaster: Array<SeasonMastermodel> = []
  bincodeLocations: Array<BincodeLocation> = [];
  itemlist: ItemList[];
  set_item_uom : string
  set_item_no : string = '';
  set_item_name : string = '';
  searchByItemNameorNo: string = '';
  searchByItemLotNo: string = '';
  itemLotNo: Array<ItemLotNoFromILEmodel> = []
  blendingcreatemodels : Array<Bulkingcreatemodel> = [];
  locationlist: Array<{location_id:string;location_name:string}>;

  constructor(
    public sessionManageMent: SessionManageMent,
    private webApiHttp: WebApiHttp,
    private _formBuilder: FormBuilder,
    private _toster: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {
    this.bulkingForm = this._formBuilder.group({
      crop: [null, Validators.required],
      season: [null, Validators.required],
      location: [null, Validators.required],
      from_stage: ['PACKING', Validators.required],
      to_stage: ['PROCESS', Validators.required],
      bincode: ['', Validators.required],
      ItemNo: ['', Validators.required],
      item_crop: ['', Validators.required],
      class_of_seed: ['', Validators.required],
      fg_pack_size: [0, Validators.required],
      marketing_lot_no: ['', Validators.required],
      total_available_qty: [0, Validators.required],
      total_available_bags : [0, Validators.required],
      expiry_date: ['', Validators.required],
      new_lot_no: ['', Validators.required],
    });

    this.dataSource = new MatTableDataSource<Bulkingcreatemodel>(this.blendingcreatemodels);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  ngOnInit(): void {
    this.get_location();
    this.get_crop();
    this.get_season_master();
    this.get_single_bincode_from_location();
    this.get_Item();
  }

  get_location() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.locationlist).then(result => {
        this.locationlist = result as LocationList[];
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      }).finally(()=>{
        this.bulkingForm.get('location').setValue(parseInt(this.sessionManageMent.getLocationId));
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
  }

  get_crop() {

    try {
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemCategoryListWithSeedType + 'SEED')
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.ItemCategoryList = result as categorymodel[];
          } else {
            this._toster.error('error', 'category not found');
            this.bulkingForm.get('crop').setValue('')
          }
        }, error => {
          this._toster.error('error', error)
        })
    } catch (e) {
      this._toster.error('error', e)
    }

  }

  get_season_master() {

    try {
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetSeasonMaster)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.seasonMaster = result as SeasonMastermodel[];
          } else {
            this._toster.error('error', 'Season Master not found');
            this.bulkingForm.get('season').setValue('')
          }
        }, error => {
          this._toster.error('error', error)
        })
    } catch (e) {
      this._toster.error('error', e)
    }

  }

  get_single_bincode_from_location() {

    try {
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetSingleBincodeWithLocation+this.sessionManageMent.getLocationId)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.bincodeLocations = result as BincodeLocation[];
            this.bulkingForm.get('bincode').setValue(this.bincodeLocations[0].bincode)
          } else {
            this._toster.error('error', 'Bincode not found');
          }
        }, error => {
          this._toster.error('error', error)
        })
    } catch (e) {
      this._toster.error('error', e)
    }

  }

  check_crop(){
    if(this.bulkingForm.get('crop').value == null){
      this._toster.warning('Please Select Crop', 'Warning');
      return false;
    }
    if(this.bulkingForm.get('season').value == null){
      this._toster.warning('Please Select Season', 'Warning');
      return false;
    }
    if(this.bulkingForm.get('from_stage').value == null){
      this._toster.warning('Please wait for from_stage to auto fill', 'Warning');
      return false;
    }
    if(this.bulkingForm.get('to_stage').value == null){
      this._toster.warning('Please wait for to_stage to auto fill', 'Warning');
      return false;
    }
    if(this.bulkingForm.get('bincode').value == null){
      this._toster.warning('Please wait for bincode to auto fill', 'Warning');
      return false;
    }
    return true;
  }

  get_Item(){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItemClassSeedFG +
        'TL&name_or_no=' + this.searchByItemNameorNo).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlist = result as ItemList[]
        } else {
          this.itemlist = [];
          this._toster.error(result[0].message, 'Error');
        }
        this.spinner.hide();
      }).catch(e => {
        this._toster.error(e, 'Error');
        this.spinner.hide();
      })
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }


  setItemDetails(item_list){
    this.bulkingForm.get('item_crop').setValue(item_list.item_crop);
    this.bulkingForm.get('class_of_seed').setValue(item_list.class_of_seed);
    this.bulkingForm.get('fg_pack_size').setValue(item_list.fg_pack_size);
    this.bulkingForm.get('total_available_qty').setValue(0);
    this.bulkingForm.get('total_available_bags').setValue(0);
    this.itemLotNo = [];
    this.bulkingForm.get('marketing_lot_no').setValue('');
    this.set_item_no = item_list.item_no;
    this.set_item_name = item_list.name;
    this.set_item_uom = item_list.baseuom;
    this.setItemLots();
  }

  setItemLots(){
    try {
      this.spinner.show();
      const json = {
        variant_code : this.bulkingForm.get('from_stage').value,
        main_category : this.bulkingForm.get('crop').value,
        sub_category : this.bulkingForm.get('item_crop').value,
        location_name : this.sessionManageMent.getLocationName,
        item_no : this.set_item_no,
        lot_no : this.searchByItemLotNo,
        season : this.bulkingForm.get('season').value
      };
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GetLotNoWithItemNoFromILE,json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemLotNo = result as ItemLotNoFromILEmodel[];
        } else {
          this.itemLotNo = [];
          this._toster.error(result[0].message, 'Error');
        }
        this.spinner.hide();
      }).catch(e => {
        this._toster.error(e, 'Error');
        this.spinner.hide();
      })
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }

  setAvailableQty(item_lot_no){
    this.bulkingForm.get('total_available_qty').setValue(item_lot_no.total_available_qty);
    this.bulkingForm.get('total_available_bags').setValue(item_lot_no.total_available_bags);
    this.setExpiryDate(item_lot_no);
  }

  setExpiryDate(item_lot_no){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_expiry_date_from_ile+item_lot_no.lot_no).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.bulkingForm.get('expiry_date').setValue(result[0].expiry_date);
        } else {
          this._toster.error(result[0].message, 'Error');
        }
        this.spinner.hide();
      }).catch(e => {
        this._toster.error(e, 'Error');
        this.spinner.hide();
      })
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }

  AddBlendingLine(){
    try {

      if (this.bulkingForm.get('total_available_qty').value > 0 &&
        this.bulkingForm.get('total_available_bags').value > 0) {

        if(this.bulkingForm.get('marketing_lot_no').value == '' || this.bulkingForm.get('marketing_lot_no').value == null){
          this._toster.error('Marketing Lot No Can Not Be Blank', 'Error');
          return;
        }

        if(this.bulkingForm.get('new_lot_no').value == '' || this.bulkingForm.get('new_lot_no').value == null){
          this._toster.error('New Lot No Can Not Be Blank', 'Error');
          return;
        }

        for (let i = 0; i < this.dataSource.data.length; i++) {
          if (this.dataSource.data[i].marketing_lot_no == this.bulkingForm.get('marketing_lot_no').value) {
            this._toster.error('Marketing Lot No ' + this.bulkingForm.get('marketing_lot_no').value + ' already exists.', 'Error');
            return;
          }
        }

        try {
          this.spinner.show();
          this.webApiHttp.Get(this.webApiHttp.ApiURLArray.check_lot_no_exists+this.bulkingForm.get('new_lot_no').value).then(result => {
            if (result[0].condition.toLowerCase() === 'true') {
              this.addbulkinglinetodatasource();
            } else {
              this._toster.error(result[0].message, 'Error');
            }
            this.spinner.hide();
          }).catch(e => {
            this._toster.error(e, 'Error');
            this.spinner.hide();
          })
        } catch (e) {
          this._toster.error(e, 'Error');
          this.spinner.hide();
        }

      } else if (this.bulkingForm.get('total_available_bags').value <= 0) {
        this._toster.warning('Total Available Bags Is Zero.', 'Warning');
      }else if (this.bulkingForm.get('total_available_qty').value <= 0) {
        this._toster.warning('Total Available Quantity Is Zero.', 'Warning');
      }
    } catch (e) {
      this._toster.error(e, 'Error');
    }
  }

  addbulkinglinetodatasource(){

    try{

      let addlines : Bulkingcreatemodel = {
        item_no:this.set_item_no,
        item_name:this.set_item_name,
        item_uom:this.set_item_uom,
        marketing_lot_no:this.bulkingForm.get('marketing_lot_no').value,
        new_lot_no:this.bulkingForm.get('new_lot_no').value,
        bincode:this.bulkingForm.get('bincode').value,
        expiry_date:this.bulkingForm.get('expiry_date').value,
        total_available_qty:this.bulkingForm.get('total_available_qty').value,
        total_available_bags:this.bulkingForm.get('total_available_bags').value,
      }

      this.blendingcreatemodels = new Array<Bulkingcreatemodel>();
      this.blendingcreatemodels.push(addlines);

      this.bulkingForm.get('marketing_lot_no').setValue('');
      this.bulkingForm.get('new_lot_no').setValue('');
      this.bulkingForm.get('total_available_bags').setValue(0);
      this.bulkingForm.get('total_available_qty').setValue(0);
      this.bulkingForm.get('expiry_date').setValue('');

      this.bulkingForm.get('crop').disable();
      this.bulkingForm.get('season').disable();
      this.bulkingForm.get('ItemNo').disable();
      this.bulkingForm.get('item_crop').disable();
      this.bulkingForm.get('class_of_seed').disable();
      this.bulkingForm.get('fg_pack_size').disable();

      if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
        this.dataSource = new MatTableDataSource<Bulkingcreatemodel>(this.blendingcreatemodels);
      } else {
        this.dataSource.data.push(addlines);
        this.dataSource = new MatTableDataSource<Bulkingcreatemodel>(this.dataSource.data);
      }

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    } catch (e) {
      this._toster.error(e, 'Error');
    }

  }

  CreateBulking() {

    if(this.dataSource.data.length<=0){
      this._toster.error('Please Add Item And Lot Details', 'Error');
      return;
    }

    var blendingLines: Array<BulkingLine> = [];

    for(let i = 0;i < this.dataSource.data.length ; i++){
      var json = {
        marketing_lot_no : this.dataSource.data[i].marketing_lot_no,
        new_lot_no : this.dataSource.data[i].new_lot_no,
        no_of_bags : this.dataSource.data[i].total_available_bags,
        quantity : this.dataSource.data[i].total_available_qty,
        expiry_date: this.dataSource.data[i].expiry_date
      }
      blendingLines.push(json);
    }

    if(blendingLines.length < 0){
      this._toster.error('Please Add Lines', 'Error');
      return;
    }

    try {
      this.spinner.show();
      const json = {
        season: this.bulkingForm.get('season').value,
        from_stage: this.bulkingForm.get('from_stage').value,
        to_stage: this.bulkingForm.get('to_stage').value,
        crop_code: this.bulkingForm.get('crop').value,
        location: this.sessionManageMent.getLocationId,
        item_no: this.set_item_no,
        bincode: this.bulkingForm.get('bincode').value,
        created_by: this.sessionManageMent.getEmail,
        lines: blendingLines
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateBulking, json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this._toster.success(result[0].message, 'Message');
          this.spinner.hide();
          this.router.navigateByUrl('/ordermanagement/bulkinglist');
        } else {
          this.spinner.hide();
          this._toster.error(result[0].message, 'Error');
        }
      }).catch(e => {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
  }

  delete_line(element: any) {
    this.dataSource.data.splice(this.dataSource.data.indexOf(element), 1);
    this.dataSource = new MatTableDataSource<Bulkingcreatemodel>(this.dataSource.data);
    if(this.dataSource.data.length == 0){
      this.bulkingForm.get('crop').enable();
      this.bulkingForm.get('season').enable();
      this.bulkingForm.get('from_stage').enable();
      this.bulkingForm.get('to_stage').enable();
      this.bulkingForm.get('ItemNo').enable();
      this.bulkingForm.get('item_crop').enable();
      this.bulkingForm.get('class_of_seed').enable();
      this.bulkingForm.get('fg_pack_size').enable();
    }
  }

  sum_footer(items: Array<Bulkingcreatemodel>, attr: string): number {
    let sum_total: number = 0
    for (let i = 0; i < items.length; i++) {
      sum_total += parseInt( items[i][attr])
    }
    //return parseFloat(sum_total.toFixed(2));
    return sum_total;
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

}
