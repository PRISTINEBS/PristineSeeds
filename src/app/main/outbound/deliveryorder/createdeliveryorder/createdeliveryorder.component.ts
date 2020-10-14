import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {
  CustomerList, deliveryOrderItemList,
  FullCustomerInfo, itemdetaillist, itemlotno,
  ItemWithAmountList,
  marketingindentno
} from "./createdeliveryordermodel";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {
  CropCodeList,
  itemGroupList,
  MarketingIndentLines,
  SessionList
} from "../../createmarketingindent/createmarketingindent";

@Component({
    selector: 'app-createdeliveryorder',
    templateUrl: './createdeliveryorder.component.html',
    styleUrls: ['./createdeliveryorder.component.scss']
})
export class CreatedeliveryorderComponent implements OnInit {


    displayedColumns: string[] = ['item_no', 'item_name','lot_no','FG_pack_size','no_of_bags','quantity', 'unit_price', 'total_amount', 'crop_code', 'variety_group', 'marketing_indent_no', 'item_class_of_seed','sales_type', 'Action'];
    dataSource: MatTableDataSource<deliveryOrderItemList>;

    @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
    @ViewChild("matSort", {static: true}) sort: MatSort;

    CustomerInfo:FormGroup;
    BasicInput: FormGroup;
    AddItem: FormGroup;
    ItemCategoryList: Array<CropCodeList> = []
    ItemSubcategoryList:Array<itemGroupList>=[];
    Itemdetail:Array<itemdetaillist>=[]
    DeliveryOrderLine: Array<deliveryOrderItemList>;
    currentdate: any = Date.now();
    searchByCustomerNameorNo: string='';
    customerlist: CustomerList[];
    addresslist: FullCustomerInfo[];
    marketingIndentNo:Array<marketingindentno>=[]
    freightType: string[] = ['Pay', 'To Pay'];
    SalesType: string[] = ['Regular', 'FGO Sales','Reminant'];
    searchByItemNameorNo: string = '';
    itemlist: ItemWithAmountList[];
    lotNo:Array<itemlotno>=[];
    sessionList:Array<SessionList>=[]
    crop_code:string


    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private spinner: NgxSpinnerService,
                private datePipe: DatePipe,
                private _formbuilder: FormBuilder) {
        this.BasicInput = _formBuilder.group({
          LRRno: ['', Validators.required],
          LRRDate: ['', Validators.required],
          VehicleNo: ['', Validators.required],
          TransporterCode: [''],
          SalespersonCode:[''],
          TransporterName:['', Validators.required],
          Freight:['', Validators.required],
          FreightTotal:['0', Validators.required],
          FreightToPay:['0', Validators.required],
          AdvancePaid:['0', Validators.required],
          RequestDeliveryDate:[''],
          PromisedDeliveryDate:[''],
        });

        this.AddItem = _formBuilder.group({
          CropCode:['', Validators.required],
          VarietyGroup:[''],
          MarketingIndentNo:[''],
          Session:['', Validators.required],
          ItemNo: ['', Validators.required],
          ItemLotNO:['', Validators.required],
          ItemGroup:['', Validators.required],
          ItemClassOfSeed:['', Validators.required],
          ItemName:['', Validators.required],
          SalesType:['', Validators.required],
          FGPackSize:['', Validators.required],
          NoOfBags:['', Validators.required],
          Quantity: [0, [Validators.required, Validators.min(0.1)]],
          UnitPrice: [0, [Validators.required, Validators.min(0.1)]],
          LineAmount:[0, [Validators.required, Validators.min(0.1)]],
        })

      this.CustomerInfo = this._formBuilder.group({
        CustomerNameorNo:['', Validators.required],
        // FreightAmount: ['0'],
      });
    }

    ngOnInit(): void {
        this.GetCropCode()
        this.get_SessionMaster();
        this.get_CustomerNo();
    }

  get_CustomerNo() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindCustomer + this.searchByCustomerNameorNo).then(result => {
                this.customerlist = result as CustomerList[];
                if (result[0].condition.toLowerCase() != 'true') {
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

  get_CustomerFull_info() {
        try {
            if (this.CustomerInfo.get('CustomerNameorNo').value != undefined && this.CustomerInfo.get('CustomerNameorNo').value != 'None' && this.CustomerInfo.get('CustomerNameorNo').value != '') {
                this.spinner.show();
                this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CustomerInfo + this.CustomerInfo.get('CustomerNameorNo').value).then(result => {
                    this.addresslist = result as FullCustomerInfo[];
                  if (result[0].condition.toLowerCase() != 'true') {
                        this._toster.error(result[0].message, 'Error');
                    }
                    this.spinner.hide();
                }).catch(e => {
                    this._toster.error(e, 'Error');
                    this.spinner.hide();
                })
            }
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }

    }

  GetCropCode(){
    try {
      this.spinner.show()
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CropCodeList)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.ItemCategoryList = result as CropCodeList[];
          } else {
            this._toster.error('error', 'category not found');
          }
        }, error => {
          this._toster.error('error', error)
        }).finally(()=>{
        this.spinner.hide();
      })
    } catch (e) {
      this._toster.error('error', e)
    }
  }


  getItemSubCategory(data,event) {

    this.itemlist=[];
    this.marketingIndentNo=[];
    this.Itemdetail=[];
     this.crop_code=event.source.selected._element.nativeElement.innerText.trim();
    try {
      if(data != undefined){
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetitemGroup+data)
          .then(result => {
            if (Array.isArray(result) && result.length) {
              this.ItemSubcategoryList = result as itemGroupList[];
            } else {
              this._toster.error('error', 'Sub category not found');
            }
          }, error => {
            this._toster.error('error', error)
          })
      }
    } catch (e) {
      this._toster.error('error', e)
    }
  }

  getitemDetailList(){
    this.AddItem.get('NoOfBags').setValue(0);
    this.AddItem.get('Quantity').setValue(0);
      try{
        this.spinner.show();
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemDetailList+this.AddItem.get('ItemNo').value)
          .then(result=>{
              if(Array.isArray(result) && result.length){
                this.Itemdetail=result as itemdetaillist[];
                this.AddItem.get('ItemName').setValue(this.Itemdetail[0].name)
                this.AddItem.get('ItemGroup').setValue(this.Itemdetail[0].item_group)
                this.AddItem.get('ItemClassOfSeed').setValue(this.Itemdetail[0].class_of_seed)
                this.AddItem.get('FGPackSize').setValue(this.Itemdetail[0].fg_pack_size)
                this.AddItem.get('UnitPrice').setValue(this.Itemdetail[0].unit_price)
              }else {
                this._toster.error('item not found','error')
              }
          },error=>{
            this._toster.error(error,'Error')
          }).finally(()=>{
            this.spinner.hide();
        })
      }catch (e) {
        this._toster.error(e,'Error')
      }
    this.getItemLotNO()
  }

  getItemLotNO(){
    try{
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetItemLotNo+this.AddItem.get('ItemNo').value
        +'&crop_code='+this.crop_code)
        .then(result=>{
          console.log(result)
          if(Array.isArray(result) && result.length){
            this.lotNo=result as itemlotno[];
          }
          else{
            this._toster.info('Lot No not found','Message')
          }
        },error=>{
          this._toster.error(error,'Error')
        }).finally(()=>{
        this.spinner.hide();
      })
    }catch (e) {
      this._toster.error(e,'Error')
    }
  }
  getQty(){
    let qty:number=0,line_qty:number=0;
    qty=this.AddItem.get('FGPackSize').value*this.AddItem.get('NoOfBags').value
    this.AddItem.get('Quantity').setValue(qty.toFixed(2))
    line_qty=this.AddItem.get('UnitPrice').value*this.AddItem.get('Quantity').value
    this.AddItem.get('LineAmount').setValue(line_qty.toFixed(2))
  }
  Get_inventory_check(){

      let sum_qty : number = 0;let rem_qty : number = 0;
      for(let i = 0 ; i<this.dataSource?.data?.length;i++){
        if(this.AddItem.get('ItemLotNO').value == this.dataSource.data[i].lot_no){
          sum_qty += this.dataSource.data[i].quantity;
        }
      }

      for(let i = 0; i < this.lotNo.length; i++){
        if(this.lotNo[i].lot_no == this.AddItem.get('ItemLotNO').value){
          rem_qty = this.lotNo[i].remaining_quantity;
        }
      }

      sum_qty += parseFloat(this.AddItem.get('Quantity').value);

      if(sum_qty > rem_qty){
        this._toster.error("Quantiy ("+sum_qty+") must be less than or equal to remaining quantity ("+rem_qty+") of lot no " + this.AddItem.get('ItemLotNO').value  ,'Error')
          this.AddItem.get('NoOfBags').setValue(0),
          this.AddItem.get('Quantity').setValue(0),
          this.AddItem.get('LineAmount').setValue(0)
        return;
      }

      const json={
        quantity:this.AddItem.get('Quantity').value,
        location_id:this.sessionManageMent.getLocationId,
        marketing_indent_no:this.AddItem.get('MarketingIndentNo').value,
        item_no: this.AddItem.get('ItemNo').value,
        season : this.AddItem.get('Session').value,
        lot_no : this.AddItem.get('ItemLotNO').value,
      }
      try{
        console.log(json)
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DeliveryOrderCheckInventory,json).then(result=>{
          console.log(result)
          if(result.length>0 && result[0].condition.toLowerCase()=='true'){
            console.log(result)
            this._toster.error(result[0].message,'Error')
            this.AddItem.get('NoOfBags').setValue(0),
              this.AddItem.get('Quantity').setValue(0),
              this.AddItem.get('LineAmount').setValue(0)
          }else{
            //this._toster.error(result[0].message,'Error')
          }
        })
      }catch (e) {

      }
  }
  clearField(){
    this.itemlist=[];
    this.Itemdetail=[];
    this.AddItem.get('ItemNo').setValue(''),
      this.AddItem.get('ItemLotNO').setValue(''),
      this.AddItem.get('ItemClassOfSeed').setValue(''),
      this.AddItem.get('ItemName').setValue(''),
      this.AddItem.get('ItemGroup').setValue(''),
      this.AddItem.get('FGPackSize').setValue(0),
      this.AddItem.get('NoOfBags').setValue(0),
      this.AddItem.get('Quantity').setValue(0),
      this.AddItem.get('UnitPrice').setValue(0),
      this.AddItem.get('LineAmount').setValue(0)

  }
  getSession(){
      let season_code : string = '';
      for (let i=0;i<this.marketingIndentNo.length;i++){
        if(this.AddItem.get('MarketingIndentNo').value==this.marketingIndentNo[i].document_no){
          season_code = this.marketingIndentNo[i].season
          break;
        }
      }
      console.log(season_code);
      return season_code;
  }
  getMarketingindentNo(){
      this.Itemdetail=[];
      this.AddItem.get('ItemNo').setValue(''),
        this.AddItem.get('ItemLotNO').setValue(''),
      this.AddItem.get('ItemClassOfSeed').setValue(''),
      this.AddItem.get('ItemName').setValue(''),
      this.AddItem.get('ItemGroup').setValue(''),
      this.AddItem.get('FGPackSize').setValue(0),
      this.AddItem.get('NoOfBags').setValue(0),
      this.AddItem.get('Quantity').setValue(0),
      this.AddItem.get('UnitPrice').setValue(0),
      this.AddItem.get('LineAmount').setValue(0)
      const json={
        customer_no:this.CustomerInfo.get('CustomerNameorNo').value,
        location_id:this.sessionManageMent.getLocationId,
        crop_code:this.AddItem.get('CropCode').value,
        variety_group: this.AddItem.get('VarietyGroup').value,
      }
      try {
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GetMarketingIndentNo,json)
          .then(result=>{
            if(Array.isArray(result) && result.length>0){
              this.marketingIndentNo=result as marketingindentno[];
            }else{
              this.marketingIndentNo=[];
              this._toster.warning('Marketing Indent no. not found ','Message')
            }
          },error=>{
            this._toster.error(error,'Error')
          })
      }catch (e) {
          this._toster.error(e,'Error')
      }
  }
  get_Item() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetItem +
              this.AddItem.get('CropCode').value+'&marketing_indent_no='+ (this.AddItem.get('MarketingIndentNo').value==undefined
              ||this.AddItem.get('MarketingIndentNo').value==null?'':this.AddItem.get('MarketingIndentNo').value)+'&location_id='+this.sessionManageMent.getLocationId).then(result => {
                if (result[0].condition.toLowerCase() === 'true') {
                    this.itemlist = result as ItemWithAmountList[];
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
  get_SessionMaster(){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetSeasonMaster).then(result=>{
        console.log(result)
        if(result.length>0 && result[0].condition.toLowerCase()=='true'){
          this.sessionList=result as SessionList[];
        }else{
          this._toster.warning('Session Not Found','Message')
        }
      },err=>{
        this._toster.error(err,'Error')
      }).finally(()=>{
        this.spinner.hide();
      })
    }catch (e) {
      this._toster.error(e,'Error');
    }
  }
  addnewitem() {
        try {
            if (this.AddItem.get('NoOfBags').value > 0 ) {
                this.spinner.show();
              let addlines : deliveryOrderItemList =  {
                  condition:'true',
                  message:'',
                  crop_code : this.crop_code,
                  variety_group : this.AddItem.get('VarietyGroup').value,
                  marketing_indent_no : this.AddItem.get('MarketingIndentNo').value,
                  item_no : this.AddItem.get('ItemNo').value,
                  lot_no : this.AddItem.get('ItemLotNO').value,
                  item_class_of_seed : this.AddItem.get('ItemClassOfSeed').value,
                  item_name : this.AddItem.get('ItemName').value,
                  sales_type : this.AddItem.get('SalesType').value,
                  FG_pack_size:this.AddItem.get('FGPackSize').value,
                  no_of_bags:parseFloat(this.AddItem.get('NoOfBags').value),
                  quantity:parseFloat(this.AddItem.get('Quantity').value),
                  unit_price:parseFloat(this.AddItem.get('UnitPrice').value),
                  total_amount:parseFloat(this.AddItem.get('LineAmount').value),
                }
              this.DeliveryOrderLine = new Array<deliveryOrderItemList>();
              this.DeliveryOrderLine.push(addlines);
                this.AddItem.get('ItemNo').setValue(''),
                this.AddItem.get('ItemLotNO').setValue(''),
                this.AddItem.get('ItemClassOfSeed').setValue(''),
                this.AddItem.get('ItemName').setValue(''),
                this.AddItem.get('ItemGroup').setValue(''),
                this.AddItem.get('FGPackSize').setValue(''),
                this.AddItem.get('NoOfBags').setValue(''),
                this.AddItem.get('Quantity').setValue(''),
                this.AddItem.get('UnitPrice').setValue(''),
                this.AddItem.get('LineAmount').setValue('')
                var verify: boolean = false
                var indexOfDatasource1: number = 0;
              if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
                this.dataSource = new MatTableDataSource<deliveryOrderItemList>(this.DeliveryOrderLine);
              } else {
                for(let i=0;i<this.dataSource.data.length;i++){
                  if(this.dataSource.data[i].item_no==addlines.item_no && this.dataSource.data[i].lot_no==addlines.lot_no){
                    verify = true;
                    indexOfDatasource1 = i;
                    break;
                  }
                }
                if(verify){
                  this.dataSource.data[indexOfDatasource1].quantity+=addlines.quantity
                  this.dataSource.data[indexOfDatasource1].no_of_bags+=addlines.no_of_bags
                  this.dataSource.data[indexOfDatasource1].total_amount+=addlines.total_amount
                }else{
                  this.dataSource.data.push(addlines);
                  this.dataSource = new MatTableDataSource<deliveryOrderItemList>(this.dataSource.data);
                }
              }
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.spinner.hide();
            } else if (this.AddItem.get('Quantity').value <= 0) {
                this._toster.warning('Put Some Quantity Before Adding it.', 'Warning');
            } else if (this.AddItem.get('Discount').value < 0) {
                this._toster.warning('No negative Discount', 'Warning');
            }
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }
    }

  CreateDeliveryorder() {

    if(this.dataSource.data.length<=0){
      this._toster.error('Please add minimum 1 line to create', 'Error');
      return;
    }
    try {
      //console.log(this.registerForm.value);
      this.spinner.show();
      const json = {
        customer_no:this.CustomerInfo.get('CustomerNameorNo').value,
        location_id:this.sessionManageMent.getLocationId,
        LRR_no :this.BasicInput.get('LRRno').value,
        LRR_date  :this.datePipe.transform(this.BasicInput.get('LRRDate').value.toLocaleString(), 'MM-dd-yyyy'),
        vehicle_no :this.BasicInput.get('VehicleNo').value,
        transporter_code :this.BasicInput.get('TransporterCode').value,
        transporter_name:this.BasicInput.get('TransporterName').value,
        salesperson_code :this.BasicInput.get('SalespersonCode').value,
        frieght :this.BasicInput.get('Freight').value,
        frieght_total :this.BasicInput.get('FreightTotal').value,
        frieght_to_pay :this.BasicInput.get('FreightToPay').value,
        advance_pay :this.BasicInput.get('AdvancePaid').value,
        season :this.AddItem.get('Session').value,
        request_delivery_date :this.datePipe.transform(this.BasicInput.get('RequestDeliveryDate').value.toLocaleString(), 'MM-dd-yyyy'),
        promised_delivery_date :this.datePipe.transform(this.BasicInput.get('PromisedDeliveryDate').value.toLocaleString(), 'MM-dd-yyyy'),
        order_lines : this.dataSource.data,
        created_by:this.sessionManageMent.getEmail,
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateDeliveryOrder, json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this._toster.success(result[0].message, 'Message');
          this.spinner.hide();
          this.router.navigateByUrl('/outbound/deliveryorderlist');
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
        this.dataSource = new MatTableDataSource<deliveryOrderItemList>(this.dataSource.data);
    }

    sum_footer(items: Array<deliveryOrderItemList>, attr: number) {
        let sum_total: number = 0
        for (let i = 0; i < items.length; i++) {
            sum_total += items[i][attr]
        }
        return sum_total
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
