import {MatIconRegistry} from "@angular/material/icon";
import {UpdategrnquantityComponent} from "../updategrnquantity/updategrnquantity.component";
import {FormBuilder} from "@angular/forms";
import {GrnInfo} from "../grnmodal";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {isNumeric} from "rxjs/internal-compatibility";

@Component({
    selector: 'app-grnwithoutscanning',
    templateUrl: './grnwithoutscanning.component.html',
    styleUrls: ['./grnwithoutscanning.component.scss']
})
export class GrnwithoutscanningComponent implements OnInit {

    grn_header_no: string;
    grn_info: GrnInfo[];

    @ViewChild('expiredate') _expiredateinput: ElementRef;

    displayedColumns: string[] = ['item_no', 'item_Info', 'document_quantity', 'received_quantity', 'grn_quantity', 'expiry_Date', 'vendor_Lotno', 'Print', 'Change'];
    dataSource: MatTableDataSource<GrnInfo>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    minDateexp: Date;
    maxDateexp: Date;
    grn_type: string;

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private _encriptDecript: EncriptDecript,
                private matIconRegistry: MatIconRegistry,
                private domSanitizer: DomSanitizer,
                private router: Router,
                private route: ActivatedRoute,
                private datePipe: DatePipe,
                private spinner: NgxSpinnerService,
                private matdialog: MatDialog
    ) {

        this.matIconRegistry.addSvgIcon(
            'barcodeprint',
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/material-icons/barcode_print.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'qtyin',
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/material-icons/in.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'change',
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/material-icons/change.svg'),
        );

        const currentYear = new Date().getFullYear();
        const currentmonth = new Date().getMonth();
        const currentday = new Date().getDate();
        this.minDateexp = new Date(currentYear, currentmonth, currentday + 15);
        this.maxDateexp = new Date(currentYear + 7, 11, 31);
    }

    ngOnInit(): void {

        var inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')))
        this.grn_header_no = inputjson.grn_header_no;
        this.grn_type = inputjson.type
        if (this.grn_type == 'Without Scan' && !this.displayedColumns.includes('new_quantity')) {
            this.displayedColumns.splice(7, 0, 'new_quantity', 'Add');
        } else if (this.grn_type == 'With Scan' && this.sessionManageMent.getBarcode.toLowerCase() != 'item' && !this.displayedColumns.includes('new_barcode')) {
            this.displayedColumns.splice(7, 0, 'new_barcode');
        } else if (this.sessionManageMent.getBarcode.toLowerCase() == 'item' && !this.displayedColumns.includes('new_quantity')) {
            this.displayedColumns.splice(7, 0, 'new_quantity', 'Add');
            this._toster.info('With Scan is not Supported for Item Based System', 'Info');
        }


        this.get_grn_info();
    }

    sum_footer(items: Array<GrnInfo>, attr: string): number {
        let sum_total: number = 0
        //this.total_scanned_barcode =0;
        for (let i = 0; i < items.length; i++) {
            sum_total += items[i][attr]
            //this.total_scanned_barcode += items[i]['grn_quantity']
        }
        return parseFloat(sum_total.toFixed(2));
    }

    get_grn_info() {
        try {
            this.spinner.show();
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GRNInfo, {GRNHeaderNo: this.grn_header_no}).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.grn_info = result as GrnInfo[]
                        if (result[0].document_type == 'Return to Origin') {
                            this.displayedColumns.splice(5, 2);
                            if (!this.displayedColumns.includes('sales_invoice_no'))
                                this.displayedColumns.splice(0, 0, 'sales_invoice_no');
                        } else if (result[0].document_type == 'Customer Return') {
                            this.displayedColumns.splice(5, 2);
                            this.grn_info[0].external_document_no = this.grn_info[0].sales_invoice_no;
                        }
                        this.dataSource = new MatTableDataSource<GrnInfo>(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
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

    complete_grn() {
        try {
            this.spinner.show();
            const json = {
                DocumentType: this.grn_info[0].document_type,
                DocumentNo: this.grn_info[0].document_no,
                GRNHeaderNo: this.grn_info[0].grn_no,
                CreatedBy: this.sessionManageMent.getEmail
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CompleteGRN, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this._toster.success(result[0].message, 'Success');
                        this.spinner.hide();
                        this.router.navigateByUrl('/inbound/findgrn');
                    } else {
                        this.spinner.hide();
                        this._toster.error(result[0].message, 'Error');
                    }

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

    print_barcode(element: any) {

    }

    new_barcode_in(element: any) {
        try {
            this.spinner.show();

            if (element.new_quantity <= 0) {
                this.spinner.hide();
                this._toster.warning('Please entry quantity first', 'Warning');
                return;
            }

            if (element.expiry_Date == 1) {
                if (isNaN(Date.parse(this.datePipe.transform(element.user_enter_expiry_Date, 'MM/dd/yyyy')))) {
                    this.spinner.hide();
                    this._toster.warning('Please entry Expiry Date first', 'Warning');
                    return;
                } else {
                    element.user_enter_expiry_Date = this.datePipe.transform(element.user_enter_expiry_Date.toLocaleString(), 'MM-dd-yyyy')
                }
            }

            if (element.vendor_Lotno == 1) {
                if (element.user_enter_lotno == undefined || element.user_enter_lotno == null || element.user_enter_lotno == '') {
                    this.spinner.hide();
                    this._toster.warning('Please entry vendor lotno first', 'Warning');
                    return;
                }
            }

            const json = {
                ProcessType: this.sessionManageMent.getBarcode,
                DocumentType: element.document_type,
                DocumentNo: element.document_no,
                DocumentLineNo: element.document_line_no,
                GRNHeaderNo: element.grn_no,
                Quantity: element.new_quantity,
                ItemNo: element.item_no,
                CreatedBy: this.sessionManageMent.getEmail,
                VendorLotNo: element.user_enter_lotno,
                ExpireDate: element.user_enter_expiry_Date,
                SalesInvoiceNo: element.sales_invoice_no
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GRNQuantityInWithoutScan, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.grn_info = result as GrnInfo[]
                        this.dataSource.data = [...this.grn_info];
                        this._toster.success('New Barcode are in. Please Print', 'Success');
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

    check_number(element: any) {
        if (isNumeric(element.new_quantity) && element.new_quantity >= 0 && element.new_quantity <= 50000) {
            if (parseInt(element.document_quantity) < (parseInt(element.received_quantity) + parseInt(element.new_quantity))) {
                this.dataSource.data[this.dataSource.data.indexOf(element)].new_quantity = 0
                this.dataSource.data = [...this.dataSource.data];
                this._toster.warning("Can't Accept more then document quantity", 'Warning')
                return false;
            }
            return true;
        } else {
            if (element.new_quantity > 50000) {
                this._toster.warning('Please Only entry quantity 50000 or less', 'Warning');
            } else {

                this._toster.warning('Only Numeric and non zero values are accepted', 'Warning');
            }
            this.dataSource.data[this.dataSource.data.indexOf(element)].new_quantity = 0;
            this.dataSource.data = [...this.dataSource.data];
            return false;
        }
    }

    update_scanned_barcode(element: any) {
        const dialog = this.matdialog.open(UpdategrnquantityComponent, {
            width: "750px",
            data: element
        })

        dialog.afterClosed().subscribe(data => {
            if (data != undefined && data.Action == 'refresh') {
                this.ngOnInit();
            }
        })
    }

    new_barcode_in_wih_scan(element: any) {
        try {
            this.spinner.show();

            if (element.new_barcode.toString().length == 0) {
                this.spinner.hide();
                this._toster.warning('Please entry Barcode first', 'Warning');
                return;
            }

            if (element.expiry_Date == 1) {
                if (isNaN(Date.parse(this.datePipe.transform(element.user_enter_expiry_Date.toLocaleString(), 'MM/dd/yyyy')))) {
                    this.spinner.hide();
                    this._toster.warning('Please entry Expiry Date first', 'Warning');
                    return;
                } else {
                    element.user_enter_expiry_Date = this.datePipe.transform(element.user_enter_expiry_Date.toLocaleString(), 'MM-dd-yyyy')
                }
            }

            if (element.vendor_Lotno == 1) {
                if (element.user_enter_lotno == undefined || element.user_enter_lotno == null || element.user_enter_lotno == '') {
                    this.spinner.hide();
                    this._toster.warning('Please entry vendor lotno first', 'Warning');
                    return;
                }
            }

            const json = {
                ProcessType: this.sessionManageMent.getBarcode,
                DocumentType: element.document_type,
                DocumentNo: element.document_no,
                DocumentLineNo: element.document_line_no,
                GRNHeaderNo: element.grn_no,
                Quantity: 1,
                Barcode: element.new_barcode,
                ItemNo: element.item_no,
                CreatedBy: this.sessionManageMent.getEmail,
                VendorLotNo: element.user_enter_lotno,
                ExpireDate: element.user_enter_expiry_Date,
                SalesInvoiceNo: element.sales_invoice_no
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GRNQuantityInWithScan, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.grn_info = result as GrnInfo[]
                        this.dataSource.data = [...this.grn_info];
                        this._toster.success('New Barcode are in. Please Print', 'Success');
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
