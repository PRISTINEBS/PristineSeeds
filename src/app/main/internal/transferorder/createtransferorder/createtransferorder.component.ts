import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {bsioitemmodel,FullCustomerInfo, itemdetails,LineInfo, LocationList, transferorderheader,
} from './createtransferordermodel';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CropCodeList, itemGroupList, SessionList} from "../../../outbound/createmarketingindent/createmarketingindent";
import {
  itemdetaillist,
  itemlotno,
  ItemWithAmountList
} from "../../../outbound/deliveryorder/createdeliveryorder/createdeliveryordermodel";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {CropStagemodel} from "../../../admin/itemmanagement/itemcategory/itemcategorymodel";

@Component({
    selector: 'app-createtransferorder',
    templateUrl: './createtransferorder.component.html',
    styleUrls: ['./createtransferorder.component.scss']
})
export class CreatetransferorderComponent implements OnInit {

    displayedColumns: string[] = ['item_no', 'item_name','stage','item_class_of_seed','variety_group','lot_no','fg_pack_size','no_of_bags','quantity','ship_no_of_bags','ship_quantity','receipt_no_of_bags','receipt_quantity', 'unit_price', 'total_amount', 'crop_code','Action'];
    dataSource: MatTableDataSource<LineInfo>;

    @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
    @ViewChild("matSort", {static: true}) sort: MatSort;
    inputjson: any;
    hideShip:boolean=false
    hidereceipt:boolean=false
    HeaderInfo:FormGroup;
    AddItem:FormGroup;
    LotNo:FormControl=new  FormControl();
    ItemCategoryList: Array<CropCodeList> = []
    currentdate: any = Date.now();
    addresslist: FullCustomerInfo[];
    searchByItemNameorNo: string = '';
    searchByCustomerNameorNo: string = '';
    SalesType: string[] = ['Regular', 'FGO Sales','Reminant'];
    ItemSubcategoryList:Array<itemGroupList>=[];
    crop_code:string;
    Itemdetail:Array<itemdetaillist>=[];
    lotNo:Array<itemlotno>=[];
    sessionList:Array<SessionList>=[];
    itemdetail:Array<bsioitemmodel>=[];
    locationlist:Array<LocationList>
    transitLocationList:Array<LocationList>=[];
    itemlist: ItemWithAmountList[];
    hidden:boolean=false
    OrderLineDetail:Array<LineInfo>=[];
    ToHeader:Array<transferorderheader>=[];
    TOline:Array<LineInfo>=[];
    get_crop_stage_master: CropStagemodel[]

  constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private spinner: NgxSpinnerService,
                private datePipe: DatePipe,
                private _formbuilder: FormBuilder,
                private _encriptDecript:EncriptDecript,
                private  route:ActivatedRoute) {
      this.AddItem = _formBuilder.group({
        CropCode:['', Validators.required],
        ItemNo:['', Validators.required],
        ItemName:['', Validators.required],
        stage:['', Validators.required],
        StageMaster:['', Validators.required],
        LotNo:['', Validators.required],
        ClassOfSeed:['', Validators.required],
        VarietyGroup:['', Validators.required],
        FGPackSize:['', Validators.required],
        NoOfBags:['', Validators.required],
        Quantity:['', Validators.required],
        ShipmentBags:['', Validators.required],
        ShipQty:['', Validators.required],
        ReceiptBags:['', Validators.required],
        ReceiptQty:['', Validators.required],
        UnitPrice:['', Validators.required],
        LineAmount:['', Validators.required],
      })

      this.HeaderInfo = this._formBuilder.group({
        TransferFrom:['', Validators.required],
        TransferTo: ['', Validators.required],
        Transferno:[''],
        TranstCode:['',Validators.required],
        Season: ['', Validators.required],
        Date:['', Validators.required]
      });

      this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')));
      switch (this.inputjson.type) {
        case 'create':
          this.gettransfer_no();
          //this.get_location();
          break;
        case 'view':
          break;
        case 'update':
          this.getToOrderInfo();
          break;
      }
    }

    ngOnInit(): void {
      this.GetCropCode();
      this.get_SessionMaster();
      this.get_location();
      // this.gettransfer_no();
    }


  getToOrderInfo(){
      try {
        const  json={
          TransferNo:this.inputjson.document_no
        }
        this.spinner.show();
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GetTransferOrderInfo,json).then(result => {
          if(result.transferOrderInfo.length>0 && result.transferOrderInfo[0].condition.toLowerCase()=='true'){
            this.ToHeader=result.transferOrderInfo
            this.TOline=result.transferOrderLineInfo
            this.HeaderInfo.get('Transferno').setValue(this.ToHeader[0].document_no)
            this.HeaderInfo.get('TransferFrom').setValue(this.ToHeader[0].transfer_from)
            this.HeaderInfo.get('TransferTo').setValue(this.ToHeader[0].transfer_to)
            this.HeaderInfo.get('TranstCode').setValue(this.ToHeader[0].transit_code)
            this.HeaderInfo.get('Season').setValue(this.ToHeader[0].season_code)
            this.HeaderInfo.get('Date').setValue(this.ToHeader[0].posting_date)
            this.dataSource = new MatTableDataSource<LineInfo>(this.TOline);
          }
          this.spinner.hide();
        }).catch(e => {
          this.spinner.hide();
          this._toster.error(e, 'Error');
        }).finally(()=>{
        })
      } catch (e) {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      }
    }
  get_Crop_From_Stage_Master() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CropStageMasterWithCategory+this.crop_code).then(result => {
       console.log(result)
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
  gettransfer_no(){
      try {
        this.spinner.show();
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.NewTransferNo).then(result => {
          if(result.length>0 && result[0].condition.toLowerCase()=='true'){
            this.HeaderInfo.get('Transferno').setValue(result[0].message)
          }
          this.spinner.hide();
        }).catch(e => {
          this.spinner.hide();
          this._toster.error(e, 'Error');
        }).finally(()=>{
        })
      } catch (e) {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      }
    }
  get_location() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.locationlist).then(result => {
        this.locationlist = result as LocationList[];
        for(let i=0;i<this.locationlist.length;i++){
          if(this.locationlist[i].location_type.toLowerCase()=='transit'){
            this.transitLocationList.push(this.locationlist[i])
          }
        }
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      }).finally(()=>{
        this.HeaderInfo.get("TransferFrom").setValue(parseInt(this.sessionManageMent.getLocationId));
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
  }
  get_Item(event) {
    this.crop_code=event.source.selected._element.nativeElement.innerText.trim();
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.getItemForTransferOrder +
        this.AddItem.get('CropCode').value+'&location_id='+this.HeaderInfo.get('TransferFrom').value).then(result => {
        if ( result.length>0 && result[0].condition.toLowerCase()=='true') {
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
    this.Itemdetail=[];
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
    try{
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.transfer_order_add_item+this.AddItem.get('LotNo').value)
        .then(result=>{
          console.log(result)
          if( result[0].condition.toLowerCase()=='true'){
            this.Itemdetail=result as itemdetails[];
           console.log(this.Itemdetail)
            this.AddItem.get('ItemName').setValue(this.Itemdetail[0].name)
            this.AddItem.get('VarietyGroup').setValue(this.Itemdetail[0].item_group)
            this.AddItem.get('stage').setValue(this.Itemdetail[0].stage)
            this.AddItem.get('ClassOfSeed').setValue(this.Itemdetail[0].class_of_seed)
            this.AddItem.get('FGPackSize').setValue(this.Itemdetail[0].fg_pack_size)
            this.AddItem.get('UnitPrice').setValue(this.Itemdetail[0].unit_price)
          }else {
            //this._toster.error('item not found','error')
            this.AddItem.get('LotNo').setValue('');
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
  addnewitem() {
    try {
      if (this.AddItem.get('NoOfBags').value > 0 ) {
        this.spinner.show();
        let addlines : LineInfo =  {
          condition:'true',
          validation:false,
          crop_code : this.crop_code,
          variety_group : this.AddItem.get('VarietyGroup').value,
          stage : this.AddItem.get('stage').value,
          item_no : this.AddItem.get('ItemNo').value,
          lot_no : this.AddItem.get('LotNo').value,
          item_class_of_seed : this.AddItem.get('ClassOfSeed').value,
          item_name : this.AddItem.get('ItemName').value,
          fg_pack_size:parseFloat(this.AddItem.get('FGPackSize').value),
          no_of_bags:parseFloat(this.AddItem.get('NoOfBags').value),
          quantity:parseFloat(this.AddItem.get('Quantity').value),
          ship_no_of_bags:parseFloat(this.AddItem.get('ShipmentBags').value),
          ship_quantity:parseFloat(this.AddItem.get('ShipQty').value),
          receipt_no_of_bags:parseFloat(this.AddItem.get('ReceiptBags').value),
          receipt_quantity: parseFloat(this.AddItem.get('ReceiptQty').value),
          unit_price:parseFloat(this.AddItem.get('UnitPrice').value),
          total_amount:parseFloat(this.AddItem.get('LineAmount').value),
        }
        this.OrderLineDetail = new Array<LineInfo>();
        this.OrderLineDetail.push(addlines);
        this.AddItem.get('ItemNo').setValue(''),
          this.AddItem.get('LotNo').setValue(''),
          this.AddItem.get('ClassOfSeed').setValue(''),
          this.AddItem.get('ItemName').setValue(''),
          this.AddItem.get('VarietyGroup').setValue(''),
          this.AddItem.get('FGPackSize').setValue(''),
          this.AddItem.get('NoOfBags').setValue(''),
          this.AddItem.get('Quantity').setValue(''),
          this.AddItem.get('ShipmentBags').setValue(''),
          this.AddItem.get('ShipQty').setValue(''),
          this.AddItem.get('ReceiptBags').setValue(''),
          this.AddItem.get('ReceiptQty').setValue(''),
          this.AddItem.get('UnitPrice').setValue(''),
          this.AddItem.get('LineAmount').setValue(''),
          this.AddItem.get('stage').setValue('')
        var verify: boolean = false
        var indexOfDatasource1: number = 0;
        if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
          this.dataSource = new MatTableDataSource<LineInfo>(this.OrderLineDetail);
        } else {
          for(let i=0;i<this.dataSource.data.length;i++){
            console.log(this.dataSource.data[i].item_no==addlines.item_no && this.dataSource.data[i].lot_no==addlines.lot_no)
            if(this.dataSource.data[i].item_no==addlines.item_no && this.dataSource.data[i].lot_no==addlines.lot_no){
              verify = true;
              console.log(verify)
              indexOfDatasource1 = i;
              break;
            }
          }
          if(verify){
            this.dataSource.data[indexOfDatasource1].quantity+=addlines.quantity
            this.dataSource.data[indexOfDatasource1].no_of_bags+=addlines.no_of_bags
            this.dataSource.data[indexOfDatasource1].total_amount+=addlines.total_amount
            this.dataSource.data[indexOfDatasource1].ship_no_of_bags+=addlines.ship_no_of_bags
            this.dataSource.data[indexOfDatasource1].ship_quantity+=addlines.ship_quantity
            this.dataSource.data[indexOfDatasource1].receipt_no_of_bags+=addlines.receipt_no_of_bags
            this.dataSource.data[indexOfDatasource1].receipt_quantity+=addlines.receipt_quantity
          }else{
            this.dataSource.data.push(addlines);
            this.dataSource = new MatTableDataSource<LineInfo>(this.dataSource.data);
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
  getItemLotNO(event){
    try{
      let stage:string=event.source.selected._element.nativeElement.innerText.trim();
      //console.log(stage.split('(')[1].split(')')[0])
      this.AddItem.get('LotNo').setValue('');
      this.spinner.show();
      this.lotNo = [];
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetLotNo+this.AddItem.get('ItemNo').value
        +'&crop_code='+this.crop_code+'&stage='+this.AddItem.get('StageMaster').value)
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
    if(this.AddItem.get('LotNo').value == '' || this.AddItem.get('LotNo').value == null){
      this._toster.warning("Please First Select Item Lot"  ,'Warning');
      return;
    }
    let qty:number=0,line_qty:number=0,bags_no:number=0
    bags_no=this.AddItem.get('NoOfBags').value
    qty=this.AddItem.get('FGPackSize').value*this.AddItem.get('NoOfBags').value
    this.AddItem.get('Quantity').setValue(qty.toFixed(2))
    this.AddItem.get('ReceiptBags').setValue(bags_no)
    this.AddItem.get('ShipmentBags').setValue(bags_no)
    this.AddItem.get('ReceiptQty').setValue(qty.toFixed(2))
    this.AddItem.get('ShipQty').setValue(qty.toFixed(2))
    line_qty=this.AddItem.get('UnitPrice').value*this.AddItem.get('Quantity').value
    this.AddItem.get('LineAmount').setValue(line_qty.toFixed(2))

  }
  getshipQty(){
    this.AddItem.get('ReceiptBags').setValue(' ')
    this.AddItem.get('ReceiptQty').setValue('')
    let ship_qty:number=0
    ship_qty=this.AddItem.get('FGPackSize').value*this.AddItem.get('ShipmentBags').value
    if(this.AddItem.get('ShipmentBags').value>this.AddItem.get('NoOfBags').value){
      this._toster.info('Cant shipment bags more than Total no of bags')
      this.AddItem.get('ShipmentBags').setValue('')
      this.AddItem.get('ShipQty').setValue('')
    }else{
      this.AddItem.get('ShipQty').setValue(ship_qty.toFixed(2))
    }
  }
  getreceiptQty(){
    let receipt_qty:number=0;

    if(this.AddItem.get('ReceiptBags').value>this.AddItem.get('ShipmentBags').value){
      this._toster.info('Cant receipt bags more than Total no of bags and shipment bags')
      this.AddItem.get('ReceiptBags').setValue('')
      this.AddItem.get('ReceiptQty').setValue('')
    }
    else{
      receipt_qty=this.AddItem.get('FGPackSize').value*this.AddItem.get('ReceiptBags').value
      this.AddItem.get('ReceiptQty').setValue(receipt_qty.toFixed(2))
    }
  }
  Get_inventory_check(){
    if(this.AddItem.get('LotNo').value == '' || this.AddItem.get('LotNo').value == null){
      this._toster.warning("Please First Select Item Lot"  ,'Warning');
      return;
    }
    let sum_qty : number = 0;let rem_qty : number = 0;
    if(this.dataSource?.data?.length>0) {
      for (let i = 0; i < this.dataSource.data.length; i++) {
        if (this.AddItem.get('LotNo').value == this.dataSource.data[i].lot_no) {
          sum_qty += this.dataSource.data[i].quantity;
        }
      }
    }

    for(let i = 0; i < this.lotNo.length; i++){
      if(this.lotNo[i].lot_no == this.AddItem.get('LotNo').value){
        rem_qty = this.lotNo[i].remaining_quantity;
      }
    }

    sum_qty += parseFloat(this.AddItem.get('Quantity').value);

    if(sum_qty > rem_qty){
      this._toster.error("Quantiy ("+sum_qty+") must be less than or equal to remaining quantity ("+rem_qty+") of lot no " + this.AddItem.get('LotNo').value  ,'Error')
      this.AddItem.get('NoOfBags').setValue(0),
        this.AddItem.get('Quantity').setValue(0),
        this.AddItem.get('LineAmount').setValue(0)
      return;
    }

    const json={
      quantity:this.AddItem.get('Quantity').value,
      location_id:this.sessionManageMent.getLocationId,
      marketing_indent_no:'',
      item_no: this.AddItem.get('ItemNo').value,
      season : this.HeaderInfo.get('Season').value,
      lot_no : this.AddItem.get('LotNo').value,
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
  check_diff_location(){
    if (this.HeaderInfo.get('TransferFrom').value=='' || this.HeaderInfo.get('TransferTo').value == this.HeaderInfo.get('TransferFrom').value ) {

      this._toster.warning('Select Different Location', 'Warning');
      //return;
    }
  }
  CreateTOShip() {
    if(this.dataSource.data.length<=0){
      this._toster.error('Please add line to create', 'Error');
      return;
    }

    try {
      this.spinner.show();
      const json = {
        TransferNo:this.HeaderInfo.get('Transferno').value,
        FromLocation:this.HeaderInfo.get('TransferFrom').value,
        posting_date:this.datePipe.transform(this.HeaderInfo.get('Date').value.toLocaleString(), 'MM-dd-yyyy'),
        ToLocation :this.HeaderInfo.get('TransferTo').value,
        TransitCode:this.HeaderInfo.get('TranstCode').value,
        season :this.HeaderInfo.get('Season').value,
        ToType:'SHIP',
        Lines : this.dataSource.data,
        CreatedBy:this.sessionManageMent.getEmail,
      }
      //console.log(this.dataSource.data)
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CompleteTransfer, json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this._toster.success(result[0].message, 'Message');
          this.hideShip=true
          this.hidereceipt=true

          this.HeaderInfo.disable()
          this.AddItem.disable()
          this.spinner.hide();
          //this.router.navigateByUrl('/outbound/Breederseedissueorderlist');
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
  CreateTOReceipt() {
    if(this.dataSource.data.length<=0){
      this._toster.error('Please add line to create', 'Error');
      return;
    }
    try {
      this.spinner.show();
      const json = {
        TransferNo:this.HeaderInfo.get('Transferno').value,
        FromLocation:this.HeaderInfo.get('TransferFrom').value,
        posting_date:this.datePipe.transform(this.HeaderInfo.get('Date').value.toLocaleString(), 'MM-dd-yyyy'),
        ToLocation :this.HeaderInfo.get('TransferTo').value,
        TransitCode:this.HeaderInfo.get('TranstCode').value,
        season :this.HeaderInfo.get('Season').value,
        ToType:'RECEIPT',
        Lines : this.dataSource.data,
        CreatedBy:this.sessionManageMent.getEmail,
      }
      //console.log(this.dataSource.data)
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CompleteTransfer, json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this._toster.success(result[0].message, 'Message');
          this.spinner.hide();
          this.router.navigateByUrl('/internal/transferorderlist');
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
        this.dataSource = new MatTableDataSource<LineInfo>(this.dataSource.data);
    }

    // sum_footer(items: Array<LineInfo>, attr: string): number {
    //     let sum_total: any = 0
    //     for (let i = 0; i < items.length; i++) {
    //         sum_total += items[i][attr]
    //     }
    //     return sum_total.toFixed(2);
    // }

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
