import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {GateEntryLines, LocationList} from "../../inbound/gateentry/creategateentry/creategateentry";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BaseUomCodeModel, categorymodel} from "../../admin/itemmanagement/itemlist/itemcreation/itemcreationmodel";
import {Vendorlistmodel} from "../../vendormanagement/vendorlist/vendorlistmodel";
import {ItemList} from "../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel";
import {StateCode} from "../../admin/partymaster/partylist/partycreation/partycreationmodel";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {
  BincodeLocation,
  ItemLotNoFromILEmodel,
  ProcessTransferLine,
  SeasonMastermodel
} from "./processtransfercreatemodel";
import {CropStagemodel} from "../../admin/itemmanagement/itemcategory/itemcategorymodel";

@Component({
  selector: 'app-processtransfercreate',
  templateUrl: './processtransfercreate.component.html',
  styleUrls: ['./processtransfercreate.component.scss']
})
export class ProcesstransfercreateComponent implements OnInit {

  displayedColumns: string[] = ['lot_no', 'from_bincode','total_available_bags','total_available_qty','required_bags','required_qty', 'process_loss_qty', 'marketing_lot_no', 'packing_item_code','date_of_testing','expiry_date', 'good_no_of_bags', 'good_qty', 'lint_no_of_bags', 'lint_qty', 'lint_bincode','remenant_no_of_bags', 'remenant_qty', 'remenant_bincode', 'to_location_code','Action'];
  dataSource: MatTableDataSource<ProcessTransferLine> = null;

  @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
  @ViewChild("matSort", {static: true}) sort: MatSort;

  processTransferForm: FormGroup;
  addItemLotForm: FormGroup;
  ItemCategoryList: Array<categorymodel> = []
  seasonMaster: Array<SeasonMastermodel> = []
  bincodeLocations: Array<BincodeLocation> = [];
  get_crop_stage_master: CropStagemodel[]
  itemlist: ItemList[];
  itemlistonrow: ItemList[];
  set_item_no : string = '';
  set_item_name : string = '';
  packing_item_code : FormControl = new FormControl();
  searchByItemNameorNo: string = '';
  searchByItemLotNo: string = '';
  itemLotNo: Array<ItemLotNoFromILEmodel> = []
  CropId: number = null;
  start: boolean = false;
  currentdate: any = Date.now();
  processTransferLine : Array<ProcessTransferLine> = [];


  constructor(
    public sessionManageMent: SessionManageMent,
    private webApiHttp: WebApiHttp,
    private _formBuilder: FormBuilder,
    private _toster: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {
    this.processTransferForm = this._formBuilder.group({
      crop: [null, Validators.required],
      season: [null, Validators.required],
      from_stage: [null, Validators.required],
      to_stage: [null, Validators.required],

    });

    this.addItemLotForm = _formBuilder.group({
      ItemNo: ['', Validators.required],
      item_crop: ['', Validators.required],
      class_of_seed: ['', Validators.required],
      fg_pack_size: [0, Validators.required],
      LotNo: ['', Validators.required],
      total_available_bags: [0, Validators.required],
      total_available_qty: [0, Validators.required],
      required_bags : [0, Validators.required],
      required_qty : [0, Validators.required],
    });

    this.dataSource = new MatTableDataSource<ProcessTransferLine>(this.processTransferLine);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  ngOnInit(): void {
    this.get_crop();
    this.get_season_master();
    this.get_single_bincode_from_location();
  }

  get_crop() {

    try {
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemCategoryListWithSeedType + 'SEED')
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.ItemCategoryList = result as categorymodel[];
          } else {
            this._toster.error('error', 'category not found');
            this.addItemLotForm.get('crop').setValue('')
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
            this.processTransferForm.get('season').setValue('')
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

  clear_all_fill_details(){
    this.itemLotNo = [];
    this.addItemLotForm.get('ItemNo').setValue('');
    this.addItemLotForm.get('item_crop').setValue('');
    this.addItemLotForm.get('class_of_seed').setValue('');
    this.addItemLotForm.get('fg_pack_size').setValue(0);
    this.addItemLotForm.get('LotNo').setValue('');
    this.addItemLotForm.get('total_available_bags').setValue(0);
    this.addItemLotForm.get('total_available_qty').setValue(0);
    this.addItemLotForm.get('required_bags').setValue(0);
    this.addItemLotForm.get('required_qty').setValue(0);
  }

  set_to_stage(sequence){
    if(this.get_crop_stage_master[sequence].stage == 'PACKING' || this.get_crop_stage_master[sequence].stage == 'LINT'
      || this.get_crop_stage_master[sequence].stage == 'REMINANT'){
      this.processTransferForm.get('from_stage').setValue(null);
      this.processTransferForm.get('to_stage').setValue('');
      this._toster.error('From Stage ' + this.get_crop_stage_master[sequence].stage.toString() + ' Not Possible', 'Error');
    }else{
      this.processTransferForm.get('to_stage').setValue(this.get_crop_stage_master[sequence+1].stage);
      this.itemLotNo = [];
      this.addItemLotForm.get('ItemNo').setValue('');
      this.addItemLotForm.get('item_crop').setValue('');
      this.addItemLotForm.get('class_of_seed').setValue('');
      this.addItemLotForm.get('fg_pack_size').setValue(0);
      this.addItemLotForm.get('LotNo').setValue('');
      this.addItemLotForm.get('total_available_bags').setValue(0);
      this.addItemLotForm.get('total_available_qty').setValue(0);
      this.addItemLotForm.get('required_bags').setValue(0);
      this.addItemLotForm.get('required_qty').setValue(0);
    }

  }

  get_Item(crop_code){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItem_Cat +
        crop_code + '&name_or_no=' + this.searchByItemNameorNo).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlist = result as ItemList[];
          if(this.searchByItemNameorNo == ''){
            this.itemlistonrow = this.itemlist;
          }
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

  get_Item_On_Line(crop_code,row_element: any){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItem_Cat +
        crop_code + '&name_or_no=' + row_element.packing_item_code).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlistonrow = result as ItemList[];
        } else {
          this.itemlistonrow = [];
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

  set_item_on_line(rowelement : any,i : number,item_list_row:any){
    this.dataSource.data[i].packing_item_code = item_list_row.item_no
  }

  check_from_stage(){
    if(this.processTransferForm.get('crop').value == null){
      this._toster.warning('Please Select Crop', 'Warning');
      return false;
    }
    if(this.processTransferForm.get('from_stage').value == null){
      this._toster.warning('Please Select From Stage', 'Warning');
      return false;
    }
    return true;
  }

  check_from_stage_and_item_no(){
    var check_stage = this.check_from_stage();
    if(check_stage){
      if(this.addItemLotForm.get('ItemNo').value == ''){
        this._toster.warning('Please Select Item No', 'Warning');
        return;
      }
    }
  }

  setItemDetails(item_list){
    if(this.processTransferForm.get('from_stage').value == null){
      this.addItemLotForm.get('ItemNo').setValue('');
      this._toster.warning('Please Select From Stage', 'Warning');
      return;
    }else{
      this.addItemLotForm.get('item_crop').setValue(item_list.item_crop);
      this.addItemLotForm.get('class_of_seed').setValue(item_list.class_of_seed);
      this.addItemLotForm.get('fg_pack_size').setValue(item_list.fg_pack_size);
      this.addItemLotForm.get('total_available_bags').setValue(0);
      this.addItemLotForm.get('total_available_qty').setValue(0);
      this.addItemLotForm.get('required_bags').setValue(0);
      this.addItemLotForm.get('required_qty').setValue(0);
      this.itemLotNo = [];
      this.addItemLotForm.get('LotNo').setValue('');
      this.set_item_no = item_list.item_no;
      this.set_item_name = item_list.name;
      this.setItemLots();
    }
  }

  setItemLots(){
    try {
      this.spinner.show();
      const json = {
        variant_code : this.processTransferForm.get('from_stage').value,
        main_category : this.processTransferForm.get('crop').value,
        sub_category : this.addItemLotForm.get('item_crop').value,
        location_name : this.sessionManageMent.getLocationName,
        item_no : this.set_item_no,
        lot_no : this.searchByItemLotNo,
        season : this.processTransferForm.get('season').value
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
    this.addItemLotForm.get('total_available_bags').setValue(item_lot_no.total_available_bags);
    this.addItemLotForm.get('total_available_qty').setValue(item_lot_no.total_available_qty);
    this.addItemLotForm.get('required_bags').setValue(item_lot_no.total_available_bags);
    this.addItemLotForm.get('required_qty').setValue(item_lot_no.total_available_qty);
  }

  check_available_bags(){
    if(this.addItemLotForm.get('required_bags').value > this.addItemLotForm.get('total_available_bags').value){
      this._toster.error('Required Bags ' +
        this.addItemLotForm.get('required_bags').value + ' cannot be more than total available bags '+
        this.addItemLotForm.get('total_available_bags').value, 'Error');
      this.addItemLotForm.get('required_bags').setValue(this.addItemLotForm.get('total_available_bags').value);
    }
  }

  check_available_qty(){
    if(this.addItemLotForm.get('required_qty').value > this.addItemLotForm.get('total_available_qty').value){
      this._toster.error('Required Qty ' +
        this.addItemLotForm.get('required_qty').value + ' cannot be more than total available Qty '+
        this.addItemLotForm.get('total_available_qty').value, 'Error');
      this.addItemLotForm.get('required_qty').setValue(this.addItemLotForm.get('total_available_qty').value);
    }
  }

  AddProcessTransferLine(){
    try {

      if (this.addItemLotForm.get('total_available_bags').value > 0 &&
        this.addItemLotForm.get('total_available_qty').value > 0 &&
        this.addItemLotForm.get('required_bags').value > 0 &&
        this.addItemLotForm.get('required_qty').value > 0) {

        for (let i = 0; i < this.dataSource.data.length; i++) {
          if (this.dataSource.data[i].lot_no == this.addItemLotForm.get('LotNo').value) {
            this._toster.error('Lot No ' + this.addItemLotForm.get('LotNo').value + ' already exists.', 'Error');
            return;
          }
        }

        let packing_item_code : string = ''
        this.packing_item_code.setValue('');

        if (this.addItemLotForm.get('class_of_seed').value.toLowerCase() == 'breeder') {
          if (this.processTransferForm.get('from_stage').value.toLowerCase() == 'cleaning') {
            packing_item_code = this.set_item_no;
            this.packing_item_code.setValue(this.set_item_no);
          }
        }

        if ((this.addItemLotForm.get('class_of_seed').value.toLowerCase() == 'foundation')
          || (this.addItemLotForm.get('class_of_seed').value.toLowerCase() == 'tl')) {

          if (this.processTransferForm.get('to_stage').value.toLowerCase() == 'packing') {

            this.checkQcResults(packing_item_code);

          }else {
            this.addLine(packing_item_code,'','');
          }
        }else{
          this.addLine(packing_item_code,'','');
        }

      } else if (this.addItemLotForm.get('total_available_bags').value <= 0) {
        this._toster.warning('Total Available Bags Is Zero.', 'Warning');
      }else if (this.addItemLotForm.get('total_available_qty').value <= 0) {
        this._toster.warning('Total Available Quantity Is Zero.', 'Warning');
      }else if (this.addItemLotForm.get('required_bags').value <= 0) {
        this._toster.warning('Put At Least One Bag Before Adding it.', 'Warning');
      } else if (this.addItemLotForm.get('required_qty').value <= 0) {
        this._toster.warning('Put Some Quantity Before Adding it.', 'Warning');
      }
    } catch (e) {
      this._toster.error(e, 'Error');
    }
  }

  checkQcResults(packing_item_code : string){
    try {
      this.spinner.show();
      const json = {
        location_id : this.sessionManageMent.getLocationId,
        item_no : this.addItemLotForm.get('ItemNo').value,
        lot_no : this.addItemLotForm.get('LotNo').value
      };
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CheckQcFinalResultDeclared,json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.spinner.hide();
          this.addLine(packing_item_code,result[0].date_of_testing,result[0].expiry_date);
        } else {
          this._toster.error(result[0].message, 'Error');
          this.spinner.hide();
          return;
        }
      }).catch(e => {
        this._toster.error(e, 'Error');
        this.spinner.hide();
        return;
      })
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
      return;
    }
  }

  addLine(packing_item_code : string,date_of_testing : string,expiry_date : string){
    let addlines : ProcessTransferLine = {
      condition: 'true',
      message : '',
      process_transfer_no:'',
      line_no:0,
      lot_no:this.addItemLotForm.get('LotNo').value,
      from_bincode:this.bincodeLocations[0].bincode,
      total_available_bags:this.addItemLotForm.get('total_available_bags').value,
      total_available_qty:this.addItemLotForm.get('total_available_qty').value,
      required_bags:this.addItemLotForm.get('required_bags').value,
      required_qty:this.addItemLotForm.get('required_qty').value,
      process_loss_qty: 0,
      marketing_lot_no: '',
      packing_item_code: packing_item_code,
      good_no_of_bags:0,
      good_qty:0,
      lint_no_of_bags:0,
      lint_qty:0,
      lint_bincode:this.bincodeLocations[0].bincode,
      remenant_no_of_bags:0,
      remenant_qty:0,
      remenant_bincode:this.bincodeLocations[0].bincode,
      to_location_code:0,
      date_of_testing : this.addItemLotForm.get('class_of_seed').value == 'TL' ? date_of_testing : '',
      expiry_date : this.addItemLotForm.get('class_of_seed').value == 'TL' ? expiry_date : ''
    }

    this.processTransferLine = new Array<ProcessTransferLine>();
    this.processTransferLine.push(addlines);

    this.addItemLotForm.get('LotNo').setValue('');
    this.addItemLotForm.get('total_available_bags').setValue(0);
    this.addItemLotForm.get('total_available_qty').setValue(0);
    this.addItemLotForm.get('required_bags').setValue(0);
    this.addItemLotForm.get('required_qty').setValue(0);

    this.processTransferForm.get('crop').disable();
    this.processTransferForm.get('season').disable();
    this.processTransferForm.get('from_stage').disable();
    this.processTransferForm.get('to_stage').disable();
    this.addItemLotForm.get('ItemNo').disable();
    this.addItemLotForm.get('item_crop').disable();
    this.addItemLotForm.get('class_of_seed').disable();
    this.addItemLotForm.get('fg_pack_size').disable();

    if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
      this.dataSource = new MatTableDataSource<ProcessTransferLine>(this.processTransferLine);
    } else {
      this.dataSource.data.push(addlines);
      this.dataSource = new MatTableDataSource<ProcessTransferLine>(this.dataSource.data);
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  change_good_bags(row_element: any,i:number){
    if(row_element.good_no_of_bags>row_element.required_bags){
      this.dataSource.data[i].good_no_of_bags=row_element.required_bags-row_element.lint_no_of_bags
      if(this.processTransferForm.get('to_stage').value == 'PACKING') {
        this.dataSource.data[i].good_qty = parseFloat((this.dataSource.data[i].good_no_of_bags * this.addItemLotForm.get('fg_pack_size').value).toFixed(2));
        this.change_good_qty(row_element, i);
      }
      this._toster.warning('Good Bags Can Not Be Greater Than Required Bags', 'Warning');
    }else{
      if(this.processTransferForm.get('to_stage').value == 'PACKING'){
        this.dataSource.data[i].good_qty = parseFloat((row_element.good_no_of_bags * this.addItemLotForm.get('fg_pack_size').value).toFixed(2));
        this.change_good_qty(row_element,i);
      }
    }
    // else{
    //   this.dataSource.data[i].lint_no_of_bags=row_element.required_bags-row_element.good_no_of_bags
    // }
  }

  change_good_qty(row_element: any,i:number){
    if(row_element.good_qty>row_element.required_qty){
      this.dataSource.data[i].good_qty=row_element.required_qty-row_element.lint_qty
      this._toster.warning('Good Quantity Can Not Be Greater Than Required Quantity', 'Warning');
    }
    this.dataSource.data[i].process_loss_qty = row_element.required_qty - (row_element.good_qty + row_element.lint_qty);
  }

  change_lint_bags(row_element: any,i:number){
    if(row_element.lint_no_of_bags>row_element.required_bags){
      this.dataSource.data[i].lint_no_of_bags=row_element.required_bags-row_element.good_no_of_bags;
      this._toster.warning('Lint Bags Can Not Be Greater Than Required Bags', 'Warning');
    }
    // else{
    //   this.dataSource.data[i].good_no_of_bags=row_element.required_bags-row_element.lint_no_of_bags
    // }
  }

  change_lint_qty(row_element: any,i:number){
    if(row_element.lint_qty>row_element.required_qty){
      this.dataSource.data[i].lint_qty=row_element.required_qty-row_element.good_qty
      this._toster.warning('Lint Quantity Can Not Be Greater Than Required Quantity', 'Warning');
    }
    this.dataSource.data[i].process_loss_qty = row_element.required_qty - (row_element.good_qty + row_element.lint_qty);
  }

  change_remenant_bags(row_element: any,i:number){
    if(row_element.remenant_no_of_bags>row_element.required_bags){
      this.dataSource.data[i].remenant_no_of_bags=row_element.required_bags-row_element.good_no_of_bags;
      this._toster.warning('Reminant Bags Can Not Be Greater Than Required Bags', 'Warning');
    }
    // else{
    //   this.dataSource.data[i].good_no_of_bags=row_element.required_bags-row_element.lint_no_of_bags
    // }
  }

  change_remenant_qty(row_element: any,i:number){
    if(row_element.remenant_qty>row_element.required_qty){
      this.dataSource.data[i].remenant_qty=row_element.required_qty-row_element.good_qty
      this._toster.warning('Reminant Quantity Can Not Be Greater Than Required Quantity', 'Warning');
    }
    this.dataSource.data[i].process_loss_qty = row_element.required_qty - (row_element.good_qty + row_element.remenant_qty);
  }

  CreateProcessTransfer() {

    if(this.dataSource.data.length<=0){
      this._toster.error('Please Add Item And Lot Details', 'Error');
      return;
    }

    for(let i = 0;i < this.dataSource.data.length ; i++){

      if(this.dataSource.data[i].good_qty == 0 && this.dataSource.data[i].lint_qty == 0 &&
        this.dataSource.data[i].remenant_qty == 0 && this.dataSource.data[i].process_loss_qty == 0){
        this._toster.error('Please Fill Quantity On Lot No ' + this.dataSource.data[i].lot_no, 'Error');
        return;
      }

      if(this.dataSource.data[i].required_qty != (this.dataSource.data[i].good_qty +
        this.dataSource.data[i].lint_qty + this.dataSource.data[i].remenant_qty + this.dataSource.data[i].process_loss_qty)){
        this._toster.error('Required Qty ('+this.dataSource.data[i].required_qty+') = ' +
          'Good Qty ('+this.dataSource.data[i].good_qty+') + Lint Qty ('+this.dataSource.data[i].lint_qty+') ' +
          'Remenant Qty ('+this.dataSource.data[i].remenant_qty+') + Process Loss Qty ('+this.dataSource.data[i].process_loss_qty+') ' +
          'On Lot No ' + this.dataSource.data[i].lot_no, 'Error');
        return;
      }

      if(this.dataSource.data[i].good_no_of_bags == 0 && this.dataSource.data[i].lint_no_of_bags == 0
        && this.dataSource.data[i].remenant_no_of_bags == 0){
        this._toster.error('Please Fill Bags On Lot No ' + this.dataSource.data[i].lot_no, 'Error');
        return;
      }

      if(this.dataSource.data[i].required_bags != this.dataSource.data[i].good_no_of_bags +
        this.dataSource.data[i].lint_no_of_bags + this.dataSource.data[i].remenant_no_of_bags){
        this._toster.error('Required Bags ('+this.dataSource.data[i].required_bags+') = ' +
          'Good No Of Bags ('+this.dataSource.data[i].good_no_of_bags+') + Lint No Of Bags ('+this.dataSource.data[i].lint_no_of_bags+') ' +
          'Remenant No Of Bags ('+this.dataSource.data[i].remenant_no_of_bags+') '+
          'On Lot No ' + this.dataSource.data[i].lot_no, 'Error');
        return;
      }

      if(this.processTransferForm.get('from_stage').value.toLowerCase() == 'cleaning'){
        if(this.dataSource.data[i].marketing_lot_no == ''){
          this._toster.error('Please Fill MarketingLotNo On Lot No ' + this.dataSource.data[i].lot_no, 'Error');
          return;
        }
        if(this.dataSource.data[i].packing_item_code == ''){
          this._toster.error('Please Fill Packing Item Code On Lot No ' + this.dataSource.data[i].lot_no, 'Error');
          return;
        }
        if(this.addItemLotForm.get('class_of_seed').value == 'TL') {
          if (this.dataSource.data[i].date_of_testing == '' || this.dataSource.data[i].date_of_testing == null) {
            this._toster.error('Date Of Testing Can Not Be Blank On Lot No ' + this.dataSource.data[i].lot_no, 'Error');
            return;
          }
          if (this.dataSource.data[i].expiry_date == '' || this.dataSource.data[i].expiry_date == null) {
            this._toster.error('Expiry Date Can Not Be Blank On Lot No ' + this.dataSource.data[i].lot_no, 'Error');
            return;
          }
        }
      }

      if(this.addItemLotForm.get('class_of_seed').value.toLowerCase() == 'breeder'){
        if(this.processTransferForm.get('from_stage').value.toLowerCase() == 'cleaning') {
          if (this.set_item_no != this.dataSource.data[i].packing_item_code) {
            this._toster.error('In Case Class Of Seeds Breeder \n' +
              'Packing Item Code (' + this.dataSource.data[i].packing_item_code + ') must be same with Item No (' + this.set_item_no + ') ' +
              'On Lot No ' + this.dataSource.data[i].lot_no, 'Error');
            return;
          }
        }
      }

    }

    try {
      this.spinner.show();
      const json = {
        season: this.processTransferForm.get('season').value,
        from_stage: this.processTransferForm.get('from_stage').value,
        to_stage: this.processTransferForm.get('to_stage').value,
        crop_code: this.processTransferForm.get('crop').value,
        location: this.sessionManageMent.getLocationId,
        item_no: this.set_item_no,
        item_name: this.set_item_name,
        item_class_of_seeds: this.addItemLotForm.get('class_of_seed').value,
        item_crop: this.addItemLotForm.get('item_crop').value,
        created_by: this.sessionManageMent.getEmail,
        lines: this.dataSource.data
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateProcessTransfer, json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this._toster.success(result[0].message, 'Message');
          this.spinner.hide();
          this.router.navigateByUrl('/processtransfer/processtransferlist');
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
    this.dataSource = new MatTableDataSource<ProcessTransferLine>(this.dataSource.data);
    if(this.dataSource.data.length == 0){
      this.processTransferForm.get('crop').enable();
      this.processTransferForm.get('season').enable();
      this.processTransferForm.get('from_stage').enable();
      this.processTransferForm.get('to_stage').enable();
      this.addItemLotForm.get('ItemNo').enable();
      this.addItemLotForm.get('item_crop').enable();
      this.addItemLotForm.get('class_of_seed').enable();
      this.addItemLotForm.get('fg_pack_size').enable();
    }
  }

  sum_footer(items: Array<ProcessTransferLine>, attr: string): number {
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
