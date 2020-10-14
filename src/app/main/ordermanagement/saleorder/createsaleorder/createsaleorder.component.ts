import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {CustomerList, FullCustomerInfo, ItemWithAmountList, SaleOrderItemList} from "./createsaleordermodel";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
    selector: 'app-createsaleorder',
    templateUrl: './createsaleorder.component.html',
    styleUrls: ['./createsaleorder.component.scss']
})
export class CreatesaleorderComponent implements OnInit {


    displayedColumns: string[] = ['item_no', 'item_descrition', 'quantity', 'cost_per_unit', 'amount', 'discount', 'total_amount', 'gst_amount', 'grand_total', 'Action'];
    dataSource: MatTableDataSource<SaleOrderItemList>;

    @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
    @ViewChild("matSort", {static: true}) sort: MatSort;


    BasicInput: FormGroup;
    AddItem: FormGroup;
    currentdate: any = Date.now();
    searchByCustomerNameorNo: string;
    customerlist: CustomerList[];
    addresslist: FullCustomerInfo[];
    paymenttype: string[] = ['COD', 'Credit', 'Prepaid'];
    searchByItemNameorNo: string = '';
    itemlist: ItemWithAmountList[];


    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private spinner: NgxSpinnerService,
                private datePipe: DatePipe,
                private _formbuilder: FormBuilder) {
        this.BasicInput = _formBuilder.group({
            CustomerNameorNo: ['', Validators.required],
            PaymentType: ['', Validators.required],
            BillToAddress: ['', Validators.required],
            ShipToAddress: ['', Validators.required],
        });

        this.AddItem = _formBuilder.group({
            ItemNo: ['', Validators.required],
            Quantity: [0, [Validators.required, Validators.min(1)]],
            Discount: [0, [Validators.required, Validators.max(100)]],
        })
    }

    ngOnInit(): void {
        this.get_to_no();
    }

    get_to_no() {

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
            if (this.BasicInput.get('CustomerNameorNo').value != undefined && this.BasicInput.get('CustomerNameorNo').value != 'None' && this.BasicInput.get('CustomerNameorNo').value != '') {
                this.spinner.show();
                this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CustomerInfo + this.BasicInput.get('CustomerNameorNo').value).then(result => {
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

    billclick(i: number) {
        this.addresslist.forEach((item) => {
            item.billtoselected = false
        });

        this.addresslist[i].billtoselected = true;
        this.BasicInput.get('BillToAddress').setValue(this.addresslist[i].id);
    }

    shipclick(i: number) {
        this.addresslist.forEach((item) => {
            item.shiptoselected = false
        });

        this.addresslist[i].shiptoselected = true;
        console.log(this.addresslist[i])
        this.BasicInput.get('ShipToAddress').setValue(this.addresslist[i].id);
    }

    get_Item() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItem + this.searchByItemNameorNo).then(result => {
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

    addnewitem() {
        try {
            if (this.AddItem.get('Quantity').value > 0 && this.AddItem.get('Discount').value >= 0) {
                this.spinner.show();
                const json = {
                    ItemNo: this.AddItem.get('ItemNo').value,
                    Quantity: this.AddItem.get('Quantity').value,
                    Discount: this.AddItem.get('Discount').value,
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AddItem, json).then(result => {
                    if (result[0].condition.toLowerCase() === 'true') {

                        this.AddItem.get('ItemNo').setValue('');
                        this.AddItem.get('Quantity').setValue(0);
                        this.AddItem.get('Discount').setValue(0);


                        if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
                            this.dataSource = new MatTableDataSource<SaleOrderItemList>(result);
                        } else {
                            this.dataSource.data.push(result[0]);
                            this.dataSource = new MatTableDataSource<SaleOrderItemList>(this.dataSource.data);
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

    delete_line(element: any) {

        this.dataSource.data.splice(this.dataSource.data.indexOf(element), 1);
        this.dataSource = new MatTableDataSource<SaleOrderItemList>(this.dataSource.data);
    }

    sum_footer(items: Array<SaleOrderItemList>, attr: string): number {
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

    complete_so() {
        try {
            this.spinner.show();
            const json = {
                CustomerNo: this.BasicInput.get('CustomerNameorNo').value,
                PaymentTerms: this.BasicInput.get('PaymentType').value,
                LocationId: this.sessionManageMent.getLocationId,
                BillToAddress: this.BasicInput.get('BillToAddress').value,
                ShipToAddress: this.BasicInput.get('ShipToAddress').value,
                CreatedBy: this.sessionManageMent.getEmail,
                lines: this.dataSource.data
            }

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.SaleOrderCreation, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this._toster.success(result[0].message, 'Success');
                        this.spinner.hide();
                        this.router.navigateByUrl('/ordermanagement/salesorderlist');

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
