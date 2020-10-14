import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {
  childseedtype,
  customerInfo,
  DeliveryOrderList, fsioitemmodel,
  FullCustomerInfo,
  LineInfo,
} from './createfoundationseedissueordermodel';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CropCodeList, itemGroupList, SessionList} from '../../createmarketingindent/createmarketingindent';
import {
  CustomerList,
  itemdetaillist,
  itemlotno
} from "../../deliveryorder/createdeliveryorder/createdeliveryordermodel";
import {
  bsioitemmodel,
  childitem
} from '../../breederseedissueorder/createbreederseedissueorder/createbreederseedissueordermodel';

@Component({
    selector: 'app-createfoundationseedissueorder',
    templateUrl: './createfoundationseedissueorder.component.html',
    styleUrls: ['./createfoundationseedissueorder.component.scss']
})
export class CreatefoundationseedissueorderComponent implements OnInit {

    displayedColumns: string[] = ['item_no', 'item_name','male_female','item_class_of_seed','variety_group','lot_no','fg_pack_size','no_of_bags','quantity', 'unit_price', 'total_amount', 'crop_code','Action'];
  dataSource: MatTableDataSource<LineInfo>;

    @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
    @ViewChild("matSort", {static: true}) sort: MatSort;

    CustomerInfo:FormGroup;
    BasicInput: FormGroup;
    AddItem:FormGroup;
    LotNo:FormControl=new  FormControl();
    ItemCategoryList: Array<CropCodeList> = []
    currentdate: any = Date.now();
    addresslist: FullCustomerInfo[];
    searchByItemNameorNo: string = '';
    LineDetail:Array<LineInfo>=[]
    OrderLineDetail:Array<LineInfo>=[];
    CustomerDetail:Array<customerInfo>=[];
    searchByCustomerNameorNo: string='';
    customerlist: CustomerList[];
    SalesType: string[] = ['Regular', 'FGO Sales','Reminant'];
    ItemSubcategoryList:Array<itemGroupList>=[];
    crop_code:string;
    Itemdetail:Array<itemdetaillist>=[];
    lotNo:Array<itemlotno>=[];
    sessionList:Array<SessionList>=[];
    seedtype:Array<childseedtype>=[];
    itemdetail:Array<fsioitemmodel>=[];
    getchilditem:Array<childitem>=[];
    hidden:boolean=false


  constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private spinner: NgxSpinnerService,
                private datePipe: DatePipe,
                private _formbuilder: FormBuilder) {
      this.AddItem = _formBuilder.group({
        SalesType:['',Validators.required],
        CropCode:['', Validators.required],
        ChildSeedType:['',Validators.required],
        Session:['', Validators.required],
        ChildSeed:['', Validators.required],
        ItemNo:['', Validators.required],
        ItemName:['', Validators.required],
        stage:['', Validators.required],
        LotNo:['', Validators.required],
        malefemale:['', Validators.required],
        ClassOfSeed:['', Validators.required],
        VarietyGroup:['', Validators.required],
        FGPackSize:['', Validators.required],
        NoOfBags:['', Validators.required],
        Quantity:['', Validators.required],
        UnitPrice:['', Validators.required],
        LineAmount:['', Validators.required],
      })

      this.CustomerInfo = this._formBuilder.group({
        CustomerNameorNo:['', Validators.required],
        LandInR:['', Validators.required],
        BillToAddress: ['', Validators.required],
        ShipToAddress: ['', Validators.required],
      });
    }

    ngOnInit(): void {
      this.get_CustomerNo();
       this.GetCropCode()
      this.get_SessionMaster()
    }

  getBsioItemNo(ItemNo:string){
    this.itemdetail=[];
    try{
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetBSIOItem+ItemNo).then(result=>{
        if(result.length>0 && result[0].condition.toLowerCase()=='true'){
          this.itemdetail=result as bsioitemmodel[];
        }else{
          this._toster.error(result[0].message,'Error')
        }
      },error=>{
        this._toster.error(error,'Error')
      })
    }catch (e) {
      this._toster.error(e,'Error')
    }
  }

  getChildItemDetails(class_of_seed : string){
    try {
      this.spinner.show()
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_item_no_with_class_of_seed+class_of_seed)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.getchilditem = result as childitem[];
          } else {
            this._toster.error('error', 'Child Item not found');
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
  GetCropCode(){
    try {
      this.spinner.show()
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetFoundationTypeCropCode)
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

  GetChildSeedType(data,event){
    this.crop_code=event?.source.selected._element.nativeElement.innerText.trim();
    try {
      this.spinner.show()
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetFoundationChildSeedType+data)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.seedtype = result as childseedtype[];
          } else {
            this._toster.error('error', 'seed type not found');
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
  getItemDetail(){
    for(let i=0;i<this.LineDetail.length;i++){
      if(this.AddItem.get('ItemNo').value==this.LineDetail[i].item_no){
        this.AddItem.get('ClassOfSeed').setValue(this.LineDetail[i].item_class_of_seed),
          this.AddItem.get('ItemName').setValue(this.LineDetail[i].item_name),
          this.AddItem.get('VarietyGroup').setValue(this.LineDetail[i].variety_group),
          this.AddItem.get('FGPackSize').setValue(this.LineDetail[i].fg_pack_size),
          this.AddItem.get('UnitPrice').setValue(this.LineDetail[i].unit_price),
          this.AddItem.get('malefemale').setValue(this.LineDetail[i].male_female)
        this.AddItem.get('stage').setValue(this.LineDetail[i].stage)
      }
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
          male_female:this.AddItem.get('malefemale').value,
          item_name : this.AddItem.get('ItemName').value,
          sales_type : this.AddItem.get('SalesType').value,
          fg_pack_size:parseFloat(this.AddItem.get('FGPackSize').value),
          no_of_bags:parseFloat(this.AddItem.get('NoOfBags').value),
          quantity:parseFloat(this.AddItem.get('Quantity').value),
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
          this.AddItem.get('UnitPrice').setValue(''),
          this.AddItem.get('LineAmount').setValue('')
          let verify :boolean=false;
          let indexOfDatasource1:number = 0;
        if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
          this.dataSource = new MatTableDataSource<LineInfo>(this.OrderLineDetail);
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
            this.dataSource = new MatTableDataSource<LineInfo>(this.dataSource.data);
          }
          // this.dataSource.data.push(addlines);
          // this.dataSource = new MatTableDataSource<LineInfo>(this.dataSource.data);
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        for(let j = 0; j <  this.itemdetail.length; j++) {
          for(let i = 0; i < this.dataSource.data.length; i++) {
            if (this.itemdetail[j].item_no == this.dataSource.data[i].item_no ) {
              this.itemdetail[j].validation = true

            }
          }
        }
        //console.log(this.LineDetail)
        for(let i = 0; i < this.itemdetail.length; i++) {
          if (this.itemdetail[i].validation == true) {
            this.hidden = true
          } else {
            this.hidden = false
          }
        }
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

  get_CustomerFull_info(customer_no:string) {
    try {
        if (this.CustomerInfo.get('CustomerNameorNo').value != undefined && this.CustomerInfo.get('CustomerNameorNo').value != 'None' && this.CustomerInfo.get('CustomerNameorNo').value != '') {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CustomerInfo +customer_no).then(result => {
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
  getLine(){
      try{
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetFSIOLine+this.AddItem.get('ItemNo').value+'&location_id='+this.sessionManageMent.getLocationId)
          .then(result=>{
            if(result.length>0 && result[0].condition.toLowerCase()=='true'){
              this.LineDetail=result as LineInfo[];
              for(let i=0;i<this.LineDetail.length;i++) {
                if (this.AddItem.get('ItemNo').value == this.LineDetail[i].item_no) {
                  this.AddItem.get('ClassOfSeed').setValue(this.LineDetail[i].item_class_of_seed),
                    this.AddItem.get('ItemName').setValue(this.LineDetail[i].item_name),
                    this.AddItem.get('VarietyGroup').setValue(this.LineDetail[i].variety_group),
                    this.AddItem.get('FGPackSize').setValue(this.LineDetail[i].fg_pack_size),
                    this.AddItem.get('UnitPrice').setValue(this.LineDetail[i].unit_price),
                    this.AddItem.get('malefemale').setValue(this.LineDetail[i].male_female)
                  this.AddItem.get('stage').setValue(this.LineDetail[i].stage)
                }
              }
              //this.dataSource=new MatTableDataSource<LineInfo>(this.LineDetail)
            }else{
              this.LineDetail=[];
                this._toster.error('Inventory Not Found','Error')
              //this.dataSource=new MatTableDataSource<LineInfo>(this.LineDetail)
            }
          })
      }catch (e) {

      }
  }
  getItemLotNO(){
    try{
      this.spinner.show();
      this.lotNo = [];
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
  set_item_on_line(rowelement : any,i : number,item_list_row:any){
    this.dataSource.data[i].lot_no = item_list_row.lot_no
    this.lotNo=[];
  }
  getQty(){
    let qty:number=0,line_qty:number=0;
    qty=this.AddItem.get('FGPackSize').value*this.AddItem.get('NoOfBags').value
    this.AddItem.get('Quantity').setValue(qty.toFixed(2))
    line_qty=this.AddItem.get('UnitPrice').value*this.AddItem.get('Quantity').value
    this.AddItem.get('LineAmount').setValue(line_qty.toFixed(2))
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

    sum_qty +=parseFloat(this.AddItem.get('Quantity').value);

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
      season : this.AddItem.get('Session').value,
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

  CreateSaleOrder() {
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
        land_in_R:this.CustomerInfo.get('LandInR').value,
        sales_type :this.AddItem.get('SalesType').value,
        season :this.AddItem.get('Session').value,
        bill_to  :this.CustomerInfo.get('BillToAddress').value,
        ship_to :this.CustomerInfo.get('ShipToAddress').value,
        order_lines : this.dataSource.data,
        created_by:this.sessionManageMent.getEmail,
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.FoundationSeedCreation, json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this._toster.success(result[0].message, 'Message');
          this.spinner.hide();
          this.router.navigateByUrl('/outbound/Foundationseedissueorderlist');
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

  billclick(i: number) {
    this.addresslist.forEach((item) => {
      item.billtoselected = false
    });

    this.addresslist[i].billtoselected = true;
    this.CustomerInfo.get('BillToAddress').setValue(this.addresslist[i].id);
  }

  shipclick(i: number) {
    this.addresslist.forEach((item) => {
      item.shiptoselected = false
    });
    this.addresslist[i].shiptoselected = true;
    console.log(this.addresslist[i])
    this.CustomerInfo.get('ShipToAddress').setValue(this.addresslist[i].id);
  }
}
