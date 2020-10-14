import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {
  GateEntryList,
  ItemList,
  PurchaseOrderInfo,
  PurchaseOrderItemList,
  VendorList
} from "./purchaseordercreatemodel";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DatePipe} from "@angular/common";
import {GeographicalZone} from "../../../admin/partymaster/partylist/partycreation/partycreationmodel";
import {
  CropStagemodel,
  Itemcategorymodel,
  Itemsubcategorymodel
} from "../../../admin/itemmanagement/itemcategory/itemcategorymodel";
import {ItemcategoryService} from "../../../admin/itemmanagement/itemcategory/itemcategory.service";
import {SeasonMastermodel} from "../../../processtransfer/processtransfercreate/processtransfercreatemodel";

@Component({
    selector: 'app-purchaseordercreate',
    templateUrl: './purchaseordercreate.component.html',
    styleUrls: ['./purchaseordercreate.component.scss']
})
export class PurchaseordercreateComponent implements OnInit {

    displayedColumns: string[] = ['item_no', 'item_descrition', 'baseuom', 'stage','lot_no', 'no_of_bags', 'quantity', 'cost_per_unit', 'amount', 'discount', 'total_amount', 'gst_amount', 'grand_total', 'Action'];
    dataSource: MatTableDataSource<PurchaseOrderItemList>;

    @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
    @ViewChild("matSort", {static: true}) sort: MatSort;

    currentdate: any = Date.now();
    purchaseForm: FormGroup;
    find_purchaseForm: FormGroup;

    complete: FormGroup;
    start: boolean = true;
    searchByGateEntryNo: string = '';
    setVendorNo: string = '';
    get_crop: Itemcategorymodel[]
    get_crop_stage_master: CropStagemodel[]
    get_crop_variety: Itemsubcategorymodel[]
    gateEntryList: GateEntryList[];
    VendorInfoWithPO: PurchaseOrderInfo[];
    itemlist: ItemList[];
    seasonMaster: Array<SeasonMastermodel> = []
    searchByItemNameorNo: string = '';
    purchaselist: Array<PurchaseOrderItemList>;
    paymentTerms: string[] = ['COD', ' 7 Days', '14 Days', '21 Days', 'Credit Memo'];
    minDateexp: any;

    constructor(public sessionManageMent: SessionManageMent,
                private _itemcategoryservice: ItemcategoryService,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private spinner: NgxSpinnerService,
                private datePipe: DatePipe) {
        this.purchaseForm = _formBuilder.group({
            ItemNo: ['', Validators.required],
            crop: ['', Validators.required],
            cropVariety: ['', Validators.required],
            baseuom: ['',Validators.required],
            stage: ['',Validators.required],
            Lotno: ['',Validators.required],
            no_of_bags: [0, Validators.required],
            Quantity: [0, Validators.required],
            Discount: [0, Validators.required],
            IsExpireDate: [false, Validators.required],
            IsVandorLotNo: [false, Validators.required]
        });

        this.find_purchaseForm = _formBuilder.group({
            GateEntryNo: ['', Validators.required]
        });


        this.complete = _formBuilder.group({
            PaymentTerms: ['', Validators.required],
            season: ['', Validators.required],
        });

        this.dataSource = new MatTableDataSource<PurchaseOrderItemList>(this.purchaselist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.minDateexp = new Date();
    }

    ngOnInit(): void {
        this.get_GateEntryNo();
        this.get_season_master();
        this.get_Crop();
    }

    get_GateEntryNo() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GateEntryInfoByidStatusCreated + this.searchByGateEntryNo).then(result => {
                if (result[0].condition.toLowerCase() == 'true') {
                  this.gateEntryList = result as GateEntryList[];
                }else{
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

    set_Vendor_No(gate_entry_list){
      this.setVendorNo = gate_entry_list.vendor_no
    }

    get_purchase_orderno_with_vendorinfo() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetVendorCompleteDetailWithPoNo + this.setVendorNo).then(result => {
                this.VendorInfoWithPO = result as PurchaseOrderInfo[];
                if (this.VendorInfoWithPO[0].condition.toLowerCase() === 'true') {
                    this.start = false;
                    this.spinner.hide();
                } else {
                    this._toster.error(this.VendorInfoWithPO[0].message, 'Error');
                    this.spinner.hide();
                }
            }).catch(e => {
                this._toster.error(e, 'Error');
                this.spinner.hide();
            })
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
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
            this.complete.get('season').setValue('')
          }
        }, error => {
          this._toster.error('error', error)
        })
    } catch (e) {
      this._toster.error('error', e)
    }

  }

    get_Crop() {
      try {
        this.spinner.show();
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemCategoryList).then(result => {
          if (result[0].hasOwnProperty('id')) {
            this.get_crop = result as Itemcategorymodel[];
          } else {
            this._toster.error('Crop Not Found', 'Error');
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

    get_Crop_Variety(crop) {
      try{
        this.get_Crop_Stage_Master(crop.name);
      }catch (e) {
      }
      try {
        this.spinner.show();
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemSubCategoryList+crop.id).then(result => {
          if (result[0].hasOwnProperty('id')) {
            this.get_crop_variety = result as Itemsubcategorymodel[];
          } else {
            this._toster.error('Crop Variety Not Found', 'Error');
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

  get_Crop_Stage_Master(crop) {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CropStageMasterWithCategory+crop).then(result => {
        if (result[0].hasOwnProperty('stage')) {
          this.get_crop_stage_master = result as CropStagemodel[];
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

    get_Item() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItem_Cat_SubCat +
              this.purchaseForm.get('crop').value +
              '&sub_cat='+this.purchaseForm.get('cropVariety').value +
              '&name_or_no=' + this.searchByItemNameorNo).then(result => {
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

  setstage(){
    if(this.purchaseForm.get('ItemNo').value.includes('FSPD')){
      if(this.purchaseForm.get('stage').value != 'RAW'){
        this._toster.warning('Seed Arrival Of '+this.purchaseForm.get('ItemNo').value+
          ' in stage '+ this.purchaseForm.get('stage').value +
          ' is not possible please select RAW stage.', 'Warning');
        this.purchaseForm.get('stage').setValue('');
        return;
      }
    }
  }

    setBaseUOM(item_list){
      if(item_list.item_no.includes('FSD')){
        this._toster.warning('Seed Arrival Of '+item_list.item_no+' is not possible please select another item.', 'Warning');
        this.purchaseForm.get('ItemNo').setValue('');
        this.purchaseForm.get('baseuom').setValue('');
        return;
      }
      if(item_list.item_no.includes('FSPD')){
        if(this.purchaseForm.get('stage').value == null || this.purchaseForm.get('stage').value == ''){

        }else{
          if(this.purchaseForm.get('stage').value != 'RAW'){
            this._toster.warning('Seed Arrival Of '+this.purchaseForm.get('ItemNo').value+
              ' in stage '+ this.purchaseForm.get('stage').value +
              ' is not possible please select RAW stage.', 'Warning');
            this.purchaseForm.get('stage').setValue('');
            return;
          }
        }
      }
      this.purchaseForm.get('baseuom').setValue(item_list.baseuom);
    }

    AddItem() {
        try {
            if (this.purchaseForm.get('Quantity').value > 0 && this.purchaseForm.get('Discount').value >= 0) {
                this.spinner.show();

                for(let i = 0;i<this.dataSource.data.length;i++){
                  if(this.purchaseForm.get('Lotno').value == this.dataSource.data[i].lot_no){
                    this._toster.error('Lot No '+ this.purchaseForm.get('Lotno').value + ' already exists.', 'Error');
                    this.spinner.hide();
                    return;
                  }
                }

                const json = {
                    ItemNo: this.purchaseForm.get('ItemNo').value,
                    VendorNo: this.VendorInfoWithPO[0].vendor_no,
                    baseuom: this.purchaseForm.get('baseuom').value,
                    stage: this.purchaseForm.get('stage').value,
                    lot_no: this.purchaseForm.get('Lotno').value,
                    no_of_bags: this.purchaseForm.get('no_of_bags').value,
                    applied_no_of_bags: 0,
                    Quantity: this.purchaseForm.get('Quantity').value,
                    Discount: this.purchaseForm.get('Discount').value,
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GetVendorItem, json).then(result => {
                    if (result[0].condition.toLowerCase() === 'true') {
                        this.purchaselist = result as PurchaseOrderItemList[];

                        this.purchaselist[0].is_expire_date = (this.purchaseForm.get('IsExpireDate').value ? 1 : 0);
                        this.purchaselist[0].is_vendor_lotno = (this.purchaseForm.get('IsVandorLotNo').value ? 1 : 0);

                        this.itemlist = [];

                        this.purchaseForm.get('IsExpireDate').setValue(false);
                        this.purchaseForm.get('IsVandorLotNo').setValue(false);
                        this.purchaseForm.get('ItemNo').setValue('');
                        this.purchaseForm.get('crop').setValue('');
                        this.purchaseForm.get('cropVariety').setValue('');
                        this.purchaseForm.get('baseuom').setValue('');
                        this.purchaseForm.get('stage').setValue('');
                        this.purchaseForm.get('Lotno').setValue('');
                        this.purchaseForm.get('no_of_bags').setValue(0);
                        this.purchaseForm.get('Quantity').setValue(0);
                        this.purchaseForm.get('Discount').setValue(0);


                        if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
                            this.dataSource = new MatTableDataSource<PurchaseOrderItemList>(this.purchaselist);
                        } else {
                            this.dataSource.data.push(this.purchaselist[0]);
                            this.dataSource = new MatTableDataSource<PurchaseOrderItemList>(this.dataSource.data);
                        }
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    } else {
                        this._toster.error(result[0].message, 'Error');

                    }
                    this.spinner.hide();
                }).catch(e => {
                    this._toster.error(e, 'Error');
                    this.spinner.hide();
                })
            } else if (this.purchaseForm.get('Quantity').value <= 0) {
                this._toster.warning('Put Some Quantity Before Adding it.', 'Warning');
            } else if (this.purchaseForm.get('Discount').value < 0) {
                this._toster.warning('No negative Discount', 'Warning');
            }
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }
    }

    delete_line(element: any) {

        this.dataSource.data.splice(this.dataSource.data.indexOf(element), 1);
        this.dataSource = new MatTableDataSource<PurchaseOrderItemList>(this.dataSource.data);
    }

    sum_footer(items: Array<PurchaseOrderItemList>, attr: string): number {
        let sum_total: number = 0
        for (let i = 0; i < items.length; i++) {
            sum_total += items[i][attr]
        }
        return parseFloat(sum_total.toFixed(2));
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

    complete_po() {
        try {
            this.spinner.show();
            const json = {
                GateEntryNo: this.find_purchaseForm.get('GateEntryNo').value,
                VendorNo: this.VendorInfoWithPO[0].vendor_no,
                PurchaseOrderNo: this.VendorInfoWithPO[0].purchase_order_no,
                PaymentTerms: this.complete.get('PaymentTerms').value,
                Season: this.complete.get('season').value,
                LocationId: this.sessionManageMent.getLocationId,
                CreatedBy: this.sessionManageMent.getEmail,
                lines: this.dataSource.data
            }

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PurchaseOrderCreation, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this._toster.success(result[0].message, 'Success');
                        this.spinner.hide();
                        this.router.navigateByUrl('/ordermanagement/purchaseorderlist');

                    } else {
                        this._toster.error(result[0].message, 'Error');

                    }
                    this.spinner.hide();
                }
            ).catch(error => {
                this._toster.error(error, 'Error');
                this.spinner.hide();
            })
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }
    }
}
