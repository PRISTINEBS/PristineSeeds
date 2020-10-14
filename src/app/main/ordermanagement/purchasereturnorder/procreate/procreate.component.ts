import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-procreate',
    templateUrl: './procreate.component.html',
    styleUrls: ['./procreate.component.scss']
})
export class ProcreateComponent implements OnInit {


    inputjson: any;
    displayedColumns: string[] = ['item_no', 'item_descrition', 'quantity', 'amount_with_tax', 'amount_without_tax', 'transfer_cost', 'gst_percentage', 'Action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    AddItem: FormGroup;
    searchByItemNameorNo: string = '';
    itemlist: Array<any>;
    vendorlist: Array<any>;
    searchByVendorNameorNo: string;

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private _encriptDecript: EncriptDecript,
                private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService,) {
        this.AddItem = _formBuilder.group({
            ItemNo: ['', Validators.required],
            Quantity: [0, [Validators.required, Validators.min(1)]],
            VendorNameorNo: ['', Validators.required],
            FromLocation: [this.sessionManageMent.getLocationId],
            PRONo: ['', Validators.required],
        });

        this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')));

        switch (this.inputjson.type) {
            case 'create':
                this.new_pro_no();
                this.get_VendorNo('');
                this.AddItem.get("FromLocation").setValue(this.sessionManageMent.getLocationName);
                break;
            case 'view':
                break;
            case 'update':
                break;
        }
    }

    ngOnInit(): void {

    }

    get_VendorNo(searchByVendorNameorNo: string) {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetVendorDetail + searchByVendorNameorNo).then(result => {
                if (result[0].condition == 'True') {
                    this.vendorlist = result;
                } else {
                    this.vendorlist = [];
                }

                this.spinner.hide();
            }).catch(e => {
                this.spinner.hide();
                this._toster.error(e, 'Error');
            })
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Error');
        }
    }

    new_pro_no() {
        try {
            this.spinner.show();
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.NewPRONo, {}).then(result => {
                if (result[0].condition.toLowerCase() === 'true') {
                    this.AddItem.get("PRONo").setValue(result[0].message);
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

    get_Item(searchByItemNameorNo: string) {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindItem + searchByItemNameorNo).then(result => {
                if (result[0].condition.toLowerCase() === 'true') {
                    this.itemlist = result;
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
            if (this.AddItem.get('Quantity').value > 0) {
                this.spinner.show();
                const json = {
                    ItemNo: this.AddItem.get('ItemNo').value,
                    Quantity: this.AddItem.get('Quantity').value
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AddNewPROItem, json).then(result => {
                    if (result[0].condition.toLowerCase() === 'true') {

                        this.AddItem.get('ItemNo').setValue('');
                        this.AddItem.get('Quantity').setValue(0);

                        if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
                            this.dataSource = new MatTableDataSource<any>(result);
                        } else {
                            this.dataSource.data.push(result[0]);
                            this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
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
            }
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }
    }

    complete_order() {
        try {
            this.spinner.show();

            const json = {
                PurchaseNo: this.AddItem.get('PRONo').value,
                CreatedBy: this.sessionManageMent.getEmail,
                FromLocation: this.sessionManageMent.getLocationId,
                VendorNo: this.AddItem.get('VendorNameorNo').value,
                Lines: this.dataSource.data
            }

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CompletePRO, json).then(result => {
                if (result[0].condition.toLowerCase() === 'true') {
                    this._toster.success(result[0].message, 'Success');
                    this.router.navigate(['/ordermanagement/prolist']);
                } else {
                    this._toster.error(result[0].message, 'Error');
                }

                this.spinner.hide();
            }).catch(e => {
                this._toster.error(e, 'Error');
                this.spinner.hide();
            })
        } catch (e) {

        }
    }

    delete_line(element: any) {

        this.dataSource.data.splice(this.dataSource.data.indexOf(element), 1);
        this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
    }

    sum_footer(items: Array<any>, attr: string): number {
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

}
