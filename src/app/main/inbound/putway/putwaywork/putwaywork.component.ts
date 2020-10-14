import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {PutwayHeader} from "./putwayworkmodel";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {UpdateputwayquantityComponent} from "./updateputwayquantity/updateputwayquantity.component";
import {PutwaybarcodelistComponent} from "./putwaybarcodelist/putwaybarcodelist.component";

@Component({
    selector: 'app-putwaywork',
    templateUrl: './putwaywork.component.html',
    styleUrls: ['./putwaywork.component.scss']
})
export class PutwayworkComponent implements OnInit {

    inputjson: any;
    putwaydata: PutwayHeader[];
    @ViewChild('bincode', {static: true}) elment_bincode: ElementRef
    @ViewChild('barcode', {static: true}) elment_barcode: ElementRef
    worktypelist: string[] = ['Scan', 'Without Scan']

    dataSource: MatTableDataSource<PutwayHeader>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    displayedColumns: string[] = ['item_no', 'accepted_qty', 'putway_qty', 'vendor_lot_no', 'expire_date', 'View'];
    putway_work: FormGroup;
    scan_type: string;

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private _encriptDecript: EncriptDecript,
                private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService,
                private composedilog: MatDialog,
                private datePipe: DatePipe,
                private matIconRegistry: MatIconRegistry,
                private domSanitizer: DomSanitizer,) {

        this.matIconRegistry.addSvgIcon(
            'choices',
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/material-icons/plines.svg'),
        );

        this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')))

        this.putway_work = _formBuilder.group({
            work_type: ['', Validators.required],
            barcode: ['', Validators.required],
            bincode: ['', Validators.required],
            quantity: ['1', [Validators.required, Validators.pattern(/^(0|[1-9]\d*)?$/)]]
        });

        this.putway_work.get('work_type').setValue('Scan')
        this.scan_type = 'Barcode'
    }

    ngOnInit(): void {
        this.getdocument_full_info(this.inputjson.putway_no);
        this.elment_bincode.nativeElement.focus();
    }

    bincode_scan() {
        try {
            this.elment_barcode.nativeElement.focus();
        } catch (e) {

        }
    }

    line_without_scan() {
        try {
            if (this.putway_work.get('work_type').value == 'Without Scan' && this.putway_work.get('barcode').value.toString().length > 1 && this.putway_work.get('bincode').value.toString().length > 1) {
                this.spinner.show();
                var json = {
                    PutwayHeaderNo: this.inputjson.putway_no,
                    Barcode: this.putway_work.get('barcode').value,
                    Bincode: this.putway_work.get('bincode').value,
                    Quantity: this.putway_work.get('quantity').value
                }

                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PutwayWithoutScanBarcode, json).then(
                    result => {
                        if (result[0].condition == 'True') {
                            this.putwaydata = result;
                            this.dataSource = new MatTableDataSource<PutwayHeader>(this.putwaydata);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;


                        } else {
                            this._toster.info(result[0].message, 'Info');
                        }
                        this.spinner.hide();
                        this.putway_work.get('barcode').setValue('');
                        this.putway_work.get('bincode').setValue('');
                        this.putway_work.get('quantity').setValue('1');
                        this.elment_bincode.nativeElement.focus();
                    }).catch(error => {
                    this.spinner.hide();
                    this._toster.error(error, 'Exception');
                })
            } else if (this.putway_work.get('bincode').value.toString().length <= 1) {
                this.elment_bincode.nativeElement.focus();
                this._toster.warning('Please Enter bincode first', 'Warning');
            } else if (this.putway_work.get('barcode').value.toString().length <= 1) {
                this.elment_barcode.nativeElement.focus();
                this._toster.warning('Please Enter barcode first', 'Warning');
            }

        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Exception');
        }
    }

    line_with_scan() {
        try {
            console.log('as');
            if (this.putway_work.get('work_type').value == 'Scan' && this.putway_work.get('barcode').value.toString().length > 1 && this.putway_work.get('bincode').value.toString().length > 1) {
                this.spinner.show();
                var json = {
                    PutwayHeaderNo: this.inputjson.putway_no,
                    Barcode: this.putway_work.get('barcode').value,
                    Bincode: this.putway_work.get('bincode').value
                }

                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PutwayScanBarcode, json).then(
                    result => {
                        if (result[0].condition == 'True') {
                            this.putwaydata = result;
                            this.dataSource = new MatTableDataSource<PutwayHeader>(this.putwaydata);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;

                        } else {
                            this._toster.info(result[0].message, 'Info');
                        }
                        this.spinner.hide();
                        this.putway_work.get('barcode').setValue('');
                        this.putway_work.get('bincode').setValue('');
                        this.elment_bincode.nativeElement.focus();
                    }).catch(error => {
                    this.spinner.hide();
                    this._toster.error(error, 'Exception');
                })
            } else if (this.putway_work.get('bincode').value.toString().length <= 1) {
                this.elment_bincode.nativeElement.focus();
                this._toster.warning('Please Enter bincode first', 'Warning');

            } else if (this.putway_work.get('barcode').value.toString().length <= 1) {
                this.elment_barcode.nativeElement.focus();
                this._toster.warning('Please Enter barcode first', 'Warning');
            }

        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Exception');
        }
    }

    complete_putway() {
        try {
            this.spinner.show();
            var json = {PutwayHeaderNo: this.putwaydata[0].putway_no, GRNHeaderNo: this.putwaydata[0].grn_no}

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PutwayComplete, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.router.navigateByUrl('/inbound/putwaylist');
                        this._toster.success(result[0].message, 'success');
                    } else {
                        this._toster.info(result[0].message, 'Info');
                    }
                    this.spinner.hide();
                }).catch(error => {
                this.spinner.hide();
                this._toster.error(error, 'Exception');
            })
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Exception');
        }
    }

    delete_line() {
        const dialog = this.composedilog.open(UpdateputwayquantityComponent, {
            width: "750px",
            data: {PutwayHeaderNo: this.inputjson.putway_no}
        })

        dialog.afterClosed().subscribe(data => {
            if (data != undefined && data.Action == 'refresh') {
                this.getdocument_full_info(this.inputjson.putway_no);
            }
        })
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

    viewinfo(element: any) {
        const dialog = this.composedilog.open(PutwaybarcodelistComponent, {
            width: "750px",
            data: {
                GRNHeaderNo: this.putwaydata[0].grn_no,
                ItemNo: element.item_no,
                VendorLot: element.vendor_lot_no,
                ExpiryDate: element.expire_date
            }
        })
    }

    private getdocument_full_info(grn_no: string | any) {
        try {
            this.spinner.show();
            var json = {PutwayHeaderNo: grn_no}

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PutwayData, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.putwaydata = result;
                        this.dataSource = new MatTableDataSource<PutwayHeader>(this.putwaydata);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;

                    } else {
                        this._toster.info(result[0].message, 'Info');
                    }
                    this.spinner.hide();
                }).catch(error => {
                this.spinner.hide();
                this._toster.error(error, 'Exception');
            })
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Exception');
        }
    }
}
