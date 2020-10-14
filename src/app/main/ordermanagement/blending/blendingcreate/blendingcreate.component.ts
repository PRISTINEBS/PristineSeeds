import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {
  BincodeLocation, ItemLotNoFromILEmodel,
  ProcessTransferLine,
  SeasonMastermodel
} from '../../../processtransfer/processtransfercreate/processtransfercreatemodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {categorymodel} from '../../../admin/itemmanagement/itemlist/itemcreation/itemcreationmodel';
import {CropStagemodel} from '../../../admin/itemmanagement/itemcategory/itemcategorymodel';
import {ItemList} from '../../purchaseorder/purchaseordercreate/purchaseordercreatemodel';
import {LocationList} from '../../../inbound/gateentry/creategateentry/creategateentry';
import {Blendingcreatemodel, BlendingLine} from './blendingcreatemodel';

@Component({
  selector: 'app-blendingcreate',
  templateUrl: './blendingcreate.component.html',
  styleUrls: ['./blendingcreate.component.scss']
})
export class BlendingcreateComponent implements OnInit {

  displayedColumns: string[] = ['item_no','item_uom','lot_no', 'bincode','total_available_bags','total_available_qty','required_bags','required_qty','Action'];
  dataSource: MatTableDataSource<Blendingcreatemodel> = null;

  @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
  @ViewChild("matSort", {static: true}) sort: MatSort;

  blendingForm: FormGroup;
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
  blendingcreatemodels : Array<Blendingcreatemodel> = [];
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
    this.blendingForm = this._formBuilder.group({
      crop: [null, Validators.required],
      season: [null, Validators.required],
      location: [null, Validators.required],
      stage: ['CLEANING', Validators.required],
      bincode: ['', Validators.required],
      ItemNo: ['', Validators.required],
      item_crop: ['', Validators.required],
      class_of_seed: ['', Validators.required],
      fg_pack_size: [0, Validators.required],
      LotNo: ['', Validators.required],
      total_available_bags: [0, Validators.required],
      total_available_qty: [0, Validators.required],
      required_bags : [0, Validators.required],
      required_qty : [0, Validators.required],
      new_lot_no : ['', Validators.required],
      remarks:[null]
    });

    this.dataSource = new MatTableDataSource<Blendingcreatemodel>(this.blendingcreatemodels);
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
        this.blendingForm.get('location').setValue(parseInt(this.sessionManageMent.getLocationId));
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
            this.blendingForm.get('crop').setValue('')
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
            this.blendingForm.get('season').setValue('')
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
            this.blendingForm.get('bincode').setValue(this.bincodeLocations[0].bincode)
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
    if(this.blendingForm.get('crop').value == null){
      this._toster.warning('Please Select Crop', 'Warning');
      return false;
    }
    if(this.blendingForm.get('season').value == null){
      this._toster.warning('Please Select Season', 'Warning');
      return false;
    }
    if(this.blendingForm.get('stage').value == null){
      this._toster.warning('Please wait for stage to auto fill', 'Warning');
      return false;
    }
    if(this.blendingForm.get('bincode').value == null){
      this._toster.warning('Please wait for bincode to auto fill', 'Warning');
      return false;
    }
    return true;
  }

  get_Item(){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItemClassSeed +
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
    this.blendingForm.get('item_crop').setValue(item_list.item_crop);
    this.blendingForm.get('class_of_seed').setValue(item_list.class_of_seed);
    this.blendingForm.get('fg_pack_size').setValue(item_list.fg_pack_size);
    this.blendingForm.get('total_available_bags').setValue(0);
    this.blendingForm.get('total_available_qty').setValue(0);
    this.blendingForm.get('required_bags').setValue(0);
    this.blendingForm.get('required_qty').setValue(0);
    this.itemLotNo = [];
    this.blendingForm.get('LotNo').setValue('');
    this.set_item_no = item_list.item_no;
    this.set_item_name = item_list.name;
    this.set_item_uom = item_list.baseuom;
    this.setItemLots();
  }

  setItemLots(){
    try {
      this.spinner.show();
      const json = {
        variant_code : this.blendingForm.get('stage').value,
        main_category : this.blendingForm.get('crop').value,
        sub_category : this.blendingForm.get('item_crop').value,
        location_name : this.sessionManageMent.getLocationName,
        item_no : this.set_item_no,
        lot_no : this.searchByItemLotNo,
        season : this.blendingForm.get('season').value
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
    this.blendingForm.get('total_available_bags').setValue(item_lot_no.total_available_bags);
    this.blendingForm.get('total_available_qty').setValue(item_lot_no.total_available_qty);
    this.blendingForm.get('required_bags').setValue(item_lot_no.total_available_bags);
    this.blendingForm.get('required_qty').setValue(item_lot_no.total_available_qty);
  }

  check_available_bags(){
    if(this.blendingForm.get('required_bags').value > this.blendingForm.get('total_available_bags').value){
      this._toster.error('Required Bags ' +
        this.blendingForm.get('required_bags').value + ' cannot be more than total available bags '+
        this.blendingForm.get('total_available_bags').value, 'Error');
      this.blendingForm.get('required_bags').setValue(this.blendingForm.get('total_available_bags').value);
    }
  }

  check_available_qty(){
    if(this.blendingForm.get('required_qty').value > this.blendingForm.get('total_available_qty').value){
      this._toster.error('Required Qty ' +
        this.blendingForm.get('required_qty').value + ' cannot be more than total available Qty '+
        this.blendingForm.get('total_available_qty').value, 'Error');
      this.blendingForm.get('required_qty').setValue(this.blendingForm.get('total_available_qty').value);
    }
  }

  AddBlendingLine(){
    try {

      if (this.blendingForm.get('total_available_bags').value > 0 &&
        this.blendingForm.get('total_available_qty').value > 0 &&
        this.blendingForm.get('required_bags').value > 0 &&
        this.blendingForm.get('required_qty').value > 0) {

        for (let i = 0; i < this.dataSource.data.length; i++) {
          if (this.dataSource.data[i].lot_no == this.blendingForm.get('LotNo').value) {
            this._toster.error('Lot No ' + this.blendingForm.get('LotNo').value + ' already exists.', 'Error');
            return;
          }
        }

        let addlines : Blendingcreatemodel = {
          item_no:this.set_item_no,
          item_name:this.set_item_name,
          item_uom:this.set_item_uom,
          lot_no:this.blendingForm.get('LotNo').value,
          bincode:this.blendingForm.get('bincode').value,
          total_available_bags:this.blendingForm.get('total_available_bags').value,
          total_available_qty:this.blendingForm.get('total_available_qty').value,
          required_bags:this.blendingForm.get('required_bags').value,
          required_qty:this.blendingForm.get('required_qty').value,
        }

        this.blendingcreatemodels = new Array<Blendingcreatemodel>();
        this.blendingcreatemodels.push(addlines);

        this.blendingForm.get('LotNo').setValue('');
        this.blendingForm.get('total_available_bags').setValue(0);
        this.blendingForm.get('total_available_qty').setValue(0);
        this.blendingForm.get('required_bags').setValue(0);
        this.blendingForm.get('required_qty').setValue(0);

        this.blendingForm.get('crop').disable();
        this.blendingForm.get('season').disable();
        this.blendingForm.get('ItemNo').disable();
        this.blendingForm.get('item_crop').disable();
        this.blendingForm.get('class_of_seed').disable();
        this.blendingForm.get('fg_pack_size').disable();

        if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
          this.dataSource = new MatTableDataSource<Blendingcreatemodel>(this.blendingcreatemodels);
        } else {
          this.dataSource.data.push(addlines);
          this.dataSource = new MatTableDataSource<Blendingcreatemodel>(this.dataSource.data);
        }

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.blendingForm.get('new_lot_no').setValue(this.set_new_lot_no());

      } else if (this.blendingForm.get('total_available_bags').value <= 0) {
        this._toster.warning('Total Available Bags Is Zero.', 'Warning');
      }else if (this.blendingForm.get('total_available_qty').value <= 0) {
        this._toster.warning('Total Available Quantity Is Zero.', 'Warning');
      }else if (this.blendingForm.get('required_bags').value <= 0) {
        this._toster.warning('Put At Least One Bag Before Adding it.', 'Warning');
      } else if (this.blendingForm.get('required_qty').value <= 0) {
        this._toster.warning('Put Some Quantity Before Adding it.', 'Warning');
      }
    } catch (e) {
      this._toster.error(e, 'Error');
    }
  }

  set_new_lot_no(){

    let larger_qty : number = 0;
    let new_lot_no : string = '';

    try{
      for(let i = 0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].required_qty > larger_qty){
          larger_qty = this.dataSource.data[i].required_qty;
          new_lot_no = this.dataSource.data[i].lot_no;
        }
      }
      return new_lot_no;
    }catch (e) {
      return '';
    }

  }

  CreateBlending() {

    if(this.dataSource.data.length<=0){
      this._toster.error('Please Add Item And Lot Details', 'Error');
      return;
    }

    if(this.blendingForm.get('new_lot_no').value == '' || this.blendingForm.get('new_lot_no').value == null){
      this._toster.error('New Lot No Can Not Be Blank', 'Error');
      return;
    }

    var blendingLines: Array<BlendingLine> = [];

    for(let i = 0;i < this.dataSource.data.length ; i++){
      var json = {
        lot_no : this.dataSource.data[i].lot_no,
        quantity : this.dataSource.data[i].required_qty,
        no_of_bags : this.dataSource.data[i].required_bags,
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
        season: this.blendingForm.get('season').value,
        stage: this.blendingForm.get('stage').value,
        crop_code: this.blendingForm.get('crop').value,
        location: this.sessionManageMent.getLocationId,
        item_no: this.set_item_no,
        bincode: this.blendingForm.get('bincode').value,
        new_lot_no: this.blendingForm.get('new_lot_no').value,
        remarks: (this.blendingForm.get('remarks').value == null
          || this.blendingForm.get('remarks').value == '')
          ? '' : this.blendingForm.get('remarks').value == '' ,
        created_by: this.sessionManageMent.getEmail,
        lines: blendingLines
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateBlending, json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this._toster.success(result[0].message, 'Message');
          this.spinner.hide();
          this.router.navigateByUrl('/ordermanagement/blendinglist');
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
    this.dataSource = new MatTableDataSource<Blendingcreatemodel>(this.dataSource.data);
    if(this.dataSource.data.length == 0){
      this.blendingForm.get('crop').enable();
      this.blendingForm.get('season').enable();
      this.blendingForm.get('stage').enable();
      this.blendingForm.get('ItemNo').enable();
      this.blendingForm.get('item_crop').enable();
      this.blendingForm.get('class_of_seed').enable();
      this.blendingForm.get('fg_pack_size').enable();
      this.blendingForm.get('new_lot_no').setValue('');
    }else{
      this.blendingForm.get('new_lot_no').setValue(this.set_new_lot_no());
    }
  }

  sum_footer(items: Array<Blendingcreatemodel>, attr: string): number {
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
