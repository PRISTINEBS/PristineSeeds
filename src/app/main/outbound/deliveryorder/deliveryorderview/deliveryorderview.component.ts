import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {isArray} from "rxjs/internal-compatibility";
import {Deliveryorderviewmodel} from "./deliveryorderviewmodel";
import {customerInfo, doInfo, doLineInfo} from "../../hybridsaleorder/hybridsaleorder/createhybridsaleordermodel";

@Component({
    selector: 'app-saleorderview',
    templateUrl: './deliveryorderview.component.html',
    styleUrls: ['./deliveryorderview.component.scss']
})
export class DeliveryorderviewComponent implements OnInit {

  delivery_order_no: string;
    order: Deliveryorderviewmodel;
  displayedColumns: string[] = ['item_no', 'item_name','lot_no','fg_pack_size','no_of_bags','quantity', 'unit_price', 'total_amount', 'crop_code', 'variety_group', 'marketing_indent_no','sales_type'];
    invoicedisplayedColumns: string[] = ['sales_invoice_no', 'box_code', 'dsp_code', 'awb_no', 'invoice_datetime', 'grand_total', 'order_status', 'View'];
    dataSource: MatTableDataSource<any>;
    invoicedataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    CustomerDetail:Array<customerInfo>=[];
    doDetail:Array<doInfo>=[];
    doLinedetail:Array<doLineInfo>=[];
    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService) {
        this.delivery_order_no = this.route.snapshot.paramMap.get('response')
    }

    ngOnInit(): void {
       this.get_doInfo()
    }


  get_doInfo(){
    try{
      this.spinner.show();
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DeliveryOrderInfo,{document_no:this.delivery_order_no})
        .then(result=>{
          console.log( result.deliveryOrderInfo[0].condition);
          if(result.customerDetail[0].condition.toLowerCase()=='true'){
            this.CustomerDetail=result.customerDetail as customerInfo[];
            console.log(this.CustomerDetail)
            this.doDetail=result.deliveryOrderInfo as doInfo[];
            this.doLinedetail=result.deliveryOrderLineInfo as doLineInfo[];
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



    viewinfo(element: any) {
        this.router.navigate(['/ordermanagement/saleinvoiceview', {response: element.sales_invoice_no}]);
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

    sum_footer(items: Array<any>, attr: string): number {
        let sum_total: number = 0
        for (let i = 0; i < items.length; i++) {
            sum_total += items[i][attr]
        }
        return parseFloat(sum_total.toFixed(2));
    }

    item_info(row: any) {
        this.router.navigate(['/admin/itemview', {res: row}]);
    }
}
