import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BincodeLocation, SeasonMastermodel} from '../../../processtransfer/processtransfercreate/processtransfercreatemodel';
import {CropStagemodel} from '../../../admin/itemmanagement/itemcategory/itemcategorymodel';
import {categorymodel} from '../../../admin/itemmanagement/itemlist/itemcreation/itemcreationmodel';
import {ItemList} from '../../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel';
import {LocationList} from '../../gateentry/creategateentry/creategateentry';

@Component({
  selector: 'app-adjusmentcreate',
  templateUrl: './adjusmentcreate.component.html',
  styleUrls: ['./adjusmentcreate.component.scss']
})
export class AdjusmentcreateComponent implements OnInit {

  adjustmentdata: Array<{ document_no: string; inventory_type: string; created_by: string; created_on: string; }> = [];
  inputjson: any;

  inventoryModel: string;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['item_no','lot_no', 'bincode','barcode','season','stage','no_of_bags', 'good_quantity', 'bad_quantity', 'Action'];
  adjustment_work: FormGroup;
  ItemCategoryList: Array<categorymodel> = []
  seasonMaster: Array<SeasonMastermodel> = [];
  get_crop_stage_master: CropStagemodel[];
  searchByItemNameorNo: string = '';
  set_item_no : string = '';
  set_item_name : string = '';
  CropId: number = null;
  itemlist: ItemList[];
  bincodeLocations: Array<BincodeLocation> = [];
  locationlist: Array<{location_id:string;location_name:string}>;
  searchBylocation: string;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,) {

    this.adjustment_work = _formBuilder.group({
      Quality: ['', Validators.required],
      Bincode: ['', Validators.required],
      ItemCode: ['', Validators.required],
      season : ['',Validators.required],
      crop : ['',Validators.required],
      item_crop : ['',Validators.required],
      class_of_seed : ['',Validators.required],
      fg_pack_size : [0,Validators.required],
      stage : ['',Validators.required],
      LotNo: [''],
      Barcode: [''],
      Quantity: [0],
      no_of_bags : [0],
      location:['',Validators.required]
    });

    this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('res')));

  }

  ngOnInit(): void {
    if (this.sessionManageMent.getBarcode == 'serial') {
      this.inventoryModel = 'serial';
      this.adjustment_work.get('Barcode').setValidators(Validators.required);
    } else if (this.sessionManageMent.getBarcode == 'lot') {
      this.inventoryModel = 'lot';
      this.adjustment_work.get('LotNo').setValidators(Validators.required);
      this.adjustment_work.get('no_of_bags').setValidators([Validators.required, Validators.min(1)]);
      this.adjustment_work.get('Quantity').setValidators([Validators.required, Validators.min(0.01)]);
    } else if (this.sessionManageMent.getBarcode == 'item') {
      this.inventoryModel = 'item';
      this.adjustment_work.get('no_of_bags').setValidators([Validators.required, Validators.min(1)]);
      this.adjustment_work.get('Quantity').setValidators([Validators.required, Validators.min(0.01)]);
    }
    this.document_info();
    this.get_crop();
    this.get_season_master();
    this.get_single_bincode_from_location();
    this.get_location();
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
        this.adjustment_work.get('location').setValue(parseInt(this.sessionManageMent.getLocationId));
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
  }

  location_name: string;
  setLoctionName(loc){
    this.location_name = loc.location_name;
  }

  get_crop() {

    try {
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemCategoryListWithSeedType + 'SEED')
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.ItemCategoryList = result as categorymodel[];
          } else {
            this._toster.error('error', 'category not found');
            this.adjustment_work.get('crop').setValue('')
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
            this.adjustment_work.get('season').setValue('')
          }
        }, error => {
          this._toster.error('error', error)
        })
    } catch (e) {
      this._toster.error('error', e)
    }

  }

  clearAllItemDetails(){
    this.adjustment_work.get('ItemCode').setValue('');
    this.adjustment_work.get('item_crop').setValue('');
    this.adjustment_work.get('class_of_seed').setValue('');
    this.adjustment_work.get('fg_pack_size').setValue('');
    this.adjustment_work.get('LotNo').setValue('');
    this.adjustment_work.get('no_of_bags').setValue(0);
    this.adjustment_work.get('Quantity').setValue(0);
    this.set_item_no = '';
    this.set_item_name = '';
  }

  setItemDetails(item_list){

    if(item_list.item_no.includes('FSD') || item_list.item_no.includes('FG')){
      this._toster.warning('Item Adjustment Of '+item_list.item_no+' is not possible please select another item.', 'Warning');
      this.adjustment_work.get('ItemCode').setValue('');
      this.adjustment_work.get('item_crop').setValue('');
      this.adjustment_work.get('class_of_seed').setValue('');
      this.adjustment_work.get('fg_pack_size').setValue('');
      this.set_item_no = '';
      this.set_item_name = '';
      return;
    }

    if(item_list.item_no.includes('FSPD') || item_list.item_no.includes('TL')){
      if(this.adjustment_work.get('stage').value != "RAW"){
        this._toster.warning('Item Adjustment Of '+item_list.item_no+
          ' in stage '+ this.adjustment_work.get('stage').value +
          ' is not possible please select another item.', 'Warning');
        this.adjustment_work.get('ItemCode').setValue('');
        this.adjustment_work.get('item_crop').setValue('');
        this.adjustment_work.get('class_of_seed').setValue('');
        this.adjustment_work.get('fg_pack_size').setValue('');
        this.set_item_no = '';
        this.set_item_name = '';
        return;
      }
    }

    this.adjustment_work.get('item_crop').setValue(item_list.item_crop);
    this.adjustment_work.get('class_of_seed').setValue(item_list.class_of_seed);
    this.adjustment_work.get('fg_pack_size').setValue(item_list.fg_pack_size);
    this.set_item_no = item_list.item_no;
    this.set_item_name = item_list.name;

  }

  get_Crop_From_Stage_Master(crop) {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CropStageMasterWithCategory+crop.code).then(result => {
        if (result[0].hasOwnProperty('stage')) {
          this.get_crop_stage_master = result as CropStagemodel[];
          this.CropId = crop.id;
          this.get_Item(crop.id);
        } else {
          this._toster.error('Crop Stage Master Not Found', 'Error');
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

  get_Item(crop_code){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItem_Cat +
        crop_code + '&name_or_no=' + this.searchByItemNameorNo).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlist = result as ItemList[];
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

  document_info() {
    try {
      this.spinner.show();
      const json = {
        DocumentNo: this.inputjson.DocumentNo
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DocumentView, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.adjustmentdata = result;
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this._toster.info(result[0].message, 'Info');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Exception');
    }
  }

  get_single_bincode_from_location() {

    try {
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetSingleBincodeWithLocation+this.sessionManageMent.getLocationId)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.bincodeLocations = result as BincodeLocation[];
            this.adjustment_work.get('Bincode').setValue(this.bincodeLocations[0].bincode)
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

  complete_adjustment() {
    try {
      if(this.dataSource.data.length <= 0){
        this._toster.info('Please Add Line For Submitting Item Adjustment', 'Info');
        return;
      }
      if(this.dataSource.data[0].document_line_no == '' || this.dataSource.data[0].document_line_no ==  null){
        this._toster.info('Please Add Line For Submitting Item Adjustment', 'Info');
        return;
      }
      this.spinner.show();
      const json = {
        DocumentNo: this.adjustmentdata[0]?.document_no
      };
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemAdjustmentComplete, json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.spinner.hide();
            this.router.navigateByUrl('/inbound/itemadjusment');
          } else {
            this._toster.info(result[0].message, 'Info');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Exception');
    }
  }

  applyFilter(filterValue: string, keyName: string) {
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false;
      }
    };
  }

  bincode_scan() {

  }

  item_no_scan() {

  }

  barcode_scan() {

  }

  new_lot_no() {
    try {
      this.spinner.show();
      const json = {
        LocationId: this.sessionManageMent.getLocationId
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.NewLotNo, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.adjustment_work.get('LotNo').setValue(result[0].message);
          } else {
            this._toster.info(result[0].message, 'Info');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Exception');
    }
  }

  Calc_no_of_qty(){
    if(this.adjustment_work.get('stage').value == 'PACKING'){
      this.adjustment_work.get('Quantity').setValue(parseFloat((this.adjustment_work.get('fg_pack_size').value
        * this.adjustment_work.get('no_of_bags').value.toString()).toFixed(2)));
    }
  }

  line_without_scan() {
    try {

      if(this.adjustment_work.get('no_of_bags').value <= 0){
        this._toster.info('No Of Bags Cannot be Less Than Or Equal To Zero' , 'Info');
        return;
      }

      if(this.adjustment_work.get('Quantity').value <= 0){
        this._toster.info('Quantity Cannot be Less Than Or Equal To Zero' , 'Info');
        return;
      }

      this.spinner.show();
      const json = {
        Quantity: this.adjustment_work.get('Quantity').value,
        Quality: this.adjustment_work.get('Quality').value,
        DocumentNo: this.adjustmentdata[0]?.document_no,
        ItemNo: this.adjustment_work.get('ItemCode').value,
        LotNo: this.adjustment_work.get('LotNo').value,
        Bincode: this.adjustment_work.get('Bincode').value,
        ProcessType: this.sessionManageMent.getBarcode,
        LocationId: this.sessionManageMent.getLocationId,
        no_of_bags : this.adjustment_work.get('no_of_bags').value,
        season : this.adjustment_work.get('season').value,
        stage : this.adjustment_work.get('stage').value,
        DocumentType : ''
      };
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AdjustmentWithoutScan, json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {

            this.adjustment_work.get('Quantity').setValue(0);
            this.adjustment_work.get('Quality').setValue('');
            this.adjustment_work.get('ItemCode').setValue('');
            this.adjustment_work.get('LotNo').setValue('');
            this.adjustment_work.get('no_of_bags').setValue(0);
            this.adjustment_work.get('season').setValue('');
            this.adjustment_work.get('stage').setValue('');
            this.adjustment_work.get('fg_pack_size').setValue(0);
            this.adjustment_work.get('item_crop').setValue('');
            this.adjustment_work.get('class_of_seed').setValue('');
            this.adjustment_work.get('crop').setValue('');
            this.adjustment_work.get('Bincode').setValue('');

            this.ngOnInit();

          } else {
            this._toster.info(result[0].message, 'Info');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Exception');
    }
  }

  delete_line_barcode(row_element : any){
    try {
      if(row_element.document_line_no == '' || row_element.document_line_no ==  null){
        this._toster.info('No Record For Deletion', 'Info');
        return;
      }
      this.spinner.show();
      const json = {
        DocumentNo: this.adjustmentdata[0]?.document_no,
        DocumentLineNo : row_element.document_line_no,
        Barcode : row_element.barcode
      };
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemAdjustmentDeleteBarcode, json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.ngOnInit();
          } else {
            this._toster.info(result[0].message, 'Info');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Exception');
    }
  }

}
