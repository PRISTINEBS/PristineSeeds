import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {
  customerInfo,
  deliveryOrderItemList, DeliveryOrderList, doInfo, doLineInfo,
  FullCustomerInfo,
  ItemWithAmountList,
} from "./createhybridsaleordermodel";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CropCodeList} from "../../createmarketingindent/createmarketingindent";

@Component({
    selector: 'app-createdeliveryorder',
    templateUrl: './createhybridsaleorder.component.html',
    styleUrls: ['./createhybridsaleorder.component.scss']
})
export class CreatehybridsaleorderComponent implements OnInit {

    displayedColumns: string[] = ['item_no', 'item_name','lot_no','fg_pack_size','no_of_bags','quantity', 'unit_price', 'total_amount', 'crop_code', 'variety_group', 'marketing_indent_no','sales_type'];
    dataSource: MatTableDataSource<doLineInfo>;

    @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
    @ViewChild("matSort", {static: true}) sort: MatSort;

    hideSubmit:boolean=false;
    CustomerInfo:FormGroup;
    BasicInput: FormGroup;
    ItemCategoryList: Array<CropCodeList> = []
    currentdate: any = Date.now();
    deliveryOrderlist: DeliveryOrderList[];
    addresslist: FullCustomerInfo[];
    searchByItemNameorNo: string = '';
    itemlist: ItemWithAmountList[];
    CustomerDetail:Array<customerInfo>=[];
    doDetail:Array<doInfo>=[];
    doLinedetail:Array<doLineInfo>=[];


    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private spinner: NgxSpinnerService,
                private datePipe: DatePipe,
                private _formbuilder: FormBuilder) {
        this.BasicInput = _formBuilder.group({
          LRRno: [''],
          LRRDate: [''],
          VehicleNo: [''],
          TransporterCode: [''],
          SalespersonCode:[''],
          TransporterName:[''],
          Freight:[''],
          FreightTotal:['0'],
          FreightToPay:['0'],
          AdvancePaid:['0'],
          RequestDeliveryDate:[''],
          PromisedDeliveryDate:[''],
        });
      this.CustomerInfo = this._formBuilder.group({
        CustomerNameorNo:['', Validators.required],
        DeliveryOrderNo:['',Validators.required],
        BillToAddress: ['', Validators.required],
        ShipToAddress: ['', Validators.required],
        // FreightAmount: ['0'],
      });
    }

    ngOnInit(): void {
        this.get_doNo()
    }

  get_doInfo(){
    try{
      this.spinner.show();
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DeliveryOrderInfo,{document_no:this.CustomerInfo.get('DeliveryOrderNo').value})
        .then(result=>{
          console.log( result.deliveryOrderInfo[0].condition);
          if(result.customerDetail[0].condition.toLowerCase()=='true'){
            this.CustomerDetail=result.customerDetail as customerInfo[];
            console.log(this.CustomerDetail)
            this.doDetail=result.deliveryOrderInfo as doInfo[];
            this.doLinedetail=result.deliveryOrderLineInfo as doLineInfo[];
            this.CustomerInfo.get('CustomerNameorNo').setValue(this.CustomerDetail[0].customer_name)
            this.BasicInput.get('LRRno').setValue(this.doDetail[0].LR_RR_no)
            this.BasicInput.get('LRRDate').setValue(this.doDetail[0].LR_RR_date)
            this.BasicInput.get('VehicleNo').setValue(this.doDetail[0].vehicle_no)
            this.BasicInput.get('TransporterCode').setValue(this.doDetail[0].transporter_code)
            this.BasicInput.get('SalespersonCode').setValue(this.doDetail[0].salesperson_code)
            this.BasicInput.get('TransporterName').setValue(this.doDetail[0].transpoter_name)
           this.get_CustomerFull_info(this.CustomerDetail[0].customer_no)
            this.dataSource=new MatTableDataSource<doLineInfo>(this.doLinedetail);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }else{
            this._toster.error('Delivery order not found','Error')
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
  get_doNo(){
      try{
        this.spinner.show();
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetDeliveryOrderNo+this.sessionManageMent.getLocationId)
          .then(result=>{
          if(Array.isArray(result) && result.length>0 && result[0].condition.toLowerCase()=='true'){
            this.deliveryOrderlist=result as DeliveryOrderList[];
          }else{
            this._toster.error('Delivery order not found','Error')
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


  CreateSaleOrder() {

    if(this.dataSource.data.length<=0){
      this._toster.error('Please add minimum 1 line to create', 'Error');
      return;
    }
    try {
      //console.log(this.registerForm.value);
      this.spinner.show();
      const json = {
        customer_no:this.CustomerDetail[0].customer_no,
        location_id:this.sessionManageMent.getLocationId,
        delivery_order_no :this.CustomerInfo.get('DeliveryOrderNo').value,
        bill_to  :this.CustomerInfo.get('BillToAddress').value,
        ship_to :this.CustomerInfo.get('ShipToAddress').value,
        order_lines : this.dataSource.data,
        created_by:this.sessionManageMent.getEmail,
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.HybridSaleOrdercreation, json).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this._toster.success(result[0].message, 'Message');
          this.spinner.hide();
          this.router.navigateByUrl('/outbound/hybridsaleorderlist');
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
        //this.dataSource = new MatTableDataSource<deliveryOrderItemList>(this.dataSource.data);
    }

    sum_footer(items: Array<doLineInfo>, attr: string): number {
        let sum_total: any = 0
        for (let i = 0; i < items.length; i++) {
            sum_total += items[i][attr]
        }
        return sum_total.toFixed(2);
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
