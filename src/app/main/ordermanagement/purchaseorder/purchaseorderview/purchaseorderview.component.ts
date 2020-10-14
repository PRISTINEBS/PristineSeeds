import {Purchaseorderviewmodel} from "./purchaseorderviewmodel";
import {FormBuilder} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Component, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {PurchasegrnbarcodeComponent} from "./purchasegrnbarcode/purchasegrnbarcode.component";
import {PurchasependinggrnquantityComponent} from "./purchasependinggrnqunatity/purchasependinggrnquantity.component";

@Component({
    selector: 'app-purchaseorderview',
    templateUrl: './purchaseorderview.component.html',
    styleUrls: ['./purchaseorderview.component.scss']
})
export class PurchaseorderviewComponent implements OnInit {

    purchase_no: any;
    order: Array<any>;
    displayedColumns: string[] = ['item_no','stage','lot_no','no_of_bags','pending_no_of_bags','applied_no_of_bags', 'quantity','pending_grn_quantity', 'received_quantity', 'accepted_quantity', 'rejected_quantity', 'mrp', 'amount', 'discount', 'gst_percentage',
        'gst_amount', 'net_amount', 'total_amount'];

    grndisplayedColumns: string[] = ['grn_no', 'grn_status','accpeted_qty', 'rejected_qty', 'grn_created_by', 'grn_created_datetime', 'external_document_no', 'external_document_date',
        'grn_completed_by', 'grn_completed_datetime'];

    dataSource: MatTableDataSource<Purchaseorderviewmodel>;
    grndataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;


    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService,
                private dialog: MatDialog) {
        this.purchase_no = this.route.snapshot.paramMap.get('response')
    }

    ngOnInit(): void {
        if (this.sessionManageMent.getGateEntryRequired == '1' && !this.grndisplayedColumns.includes('gate_entry_no')) {
            this.grndisplayedColumns.splice(1, 0, 'gate_entry_no');
        }

        this.get_purchase_order_info();
        this.get_purchase_order_grn_info();
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

    get_purchase_order_info() {
        try {
            this.spinner.show();
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.POInfo, {PurchaseOrderNo: this.purchase_no}).then(result => {
                if (result[0].condition == 'True') {
                    this.dataSource = new MatTableDataSource<Purchaseorderviewmodel>(result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.order = result;
                } else {
                    this._toster.info(result[0].message, 'Info')
                }
                this.spinner.hide();
            }).catch(error => {
                this._toster.error(error, 'Error')
                this.spinner.hide();
            })
        } catch (e) {
            this._toster.error(e, 'Error')
            this.spinner.show();
        }
    }

    get_purchase_order_grn_info() {
        try {
            this.spinner.show();
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.POGRNInfo, {PurchaseOrderNo: this.purchase_no}).then(result => {
                if (result[0].condition == 'True') {
                    this.grndataSource = new MatTableDataSource<any>(result);
                    /*this.grndataSource.paginator = this.paginator;
                    this.grndataSource.sort = this.sort;*/
                } else {
                    this._toster.info(result[0].message, 'Info')
                }
                this.spinner.hide();
            }).catch(error => {
                this._toster.error(error, 'Error')
                this.spinner.hide();
            })
        } catch (e) {
            this._toster.error(e, 'Error')
            this.spinner.show();
        }
    }

    auto_grn_putaway_post(){

      const data = this.dataSource.data;
      const dialog = this.dialog.open(PurchasependinggrnquantityComponent, {width: '800px',data})
      dialog.afterClosed().subscribe(data=>{
        if (data==true){
          this.ngOnInit();
        }
      })
    }

    grn_item_info($event: any) {
        const data = $event.gib;
        const dialog = this.dialog.open(PurchasegrnbarcodeComponent, {width: '800px', data});
    }
}
