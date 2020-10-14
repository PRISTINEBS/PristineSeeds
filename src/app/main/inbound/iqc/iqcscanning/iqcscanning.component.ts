import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormControl} from "@angular/forms";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {IQC, IQCLine} from "./iqcscanningmodel";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {MatDialog} from "@angular/material/dialog";
import {IqcbarcodelistComponent} from "./iqcbarcodelist/iqcbarcodelist.component";

@Component({
    selector: 'app-iqcscanning',
    templateUrl: './iqcscanning.component.html',
    styleUrls: ['./iqcscanning.component.scss']
})
export class IqcscanningComponent implements OnInit {


    displayedColumns: string[] = ['item_no', 'bincode', 'barcode', 'rejection_reason', 'expire_date', 'vendor_lot_no', 'qty', 'Action'];
    dataSource: MatTableDataSource<IQCLine>;
    iqc: IQC[];
    barcode = new FormControl();
    bincode = new FormControl();
    rejectionreason = new FormControl();
    inputjson: any

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    rejection_reason: string[] = ['Damage', 'Cut', 'Wrong', 'Burned', 'Expired'];


    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private _encriptDecript: EncriptDecript,
                private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService,
                private composedilog: MatDialog,
                private datePipe: DatePipe) {
        this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')))
        this.getdocument_full_info(this.inputjson.grn_no);

    }

    ngOnInit(): void {

    }

    getdocument_full_info(grn_no: string) {
        try {
            this.spinner.show();
            var json = {
                GRNHeaderNo: grn_no
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.IQCData, json).then(
                result => {
                    if (result[0].header[0].condition == 'True') {
                        this.iqc = result as IQC[];
                        if (this.iqc[0].lines[0].condition == 'True') {
                            this.dataSource = new MatTableDataSource<IQCLine>(this.iqc[0].lines);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                        }
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

    scanbarcode() {
        try {
            if (this.rejectionreason.value != '' && this.barcode.value != '' && this.rejectionreason.value != null && this.barcode.value != null) {
                this.spinner.show();
                var json = {
                    GRNHeaderNo: this.inputjson.grn_no,
                    Barcode: this.barcode.value,
                    Bincode: this.bincode.value,
                    LocationId: this.sessionManageMent.getLocationId,
                    RejectionReason: this.rejectionreason.value
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.IQCScanBarcode, json).then(
                    result => {
                        if (result[0].header[0].condition == 'True') {
                            this.iqc = result as IQC[];
                            if (this.iqc[0].lines[0].condition == 'True') {
                                this.dataSource = new MatTableDataSource<IQCLine>(this.iqc[0].lines);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                            }
                        } else {
                            this._toster.info(result[0].header[0].message, 'Info');
                        }
                        this.rejectionreason.setValue('');
                        this.barcode.setValue('');
                        this.bincode.setValue('');
                        this.spinner.hide();
                    }).catch(error => {
                    this.spinner.hide();
                    this._toster.error(error, 'Exception');
                })
            } else if (this.rejectionreason.value != '' || this.rejectionreason.value != null) {
                this._toster.warning('Please Select Rejection First', 'Warning');
            } else if (this.barcode.value != '' || this.barcode.value != null) {
                this._toster.warning('Please enter any barcode First', 'Warning');
            }
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Exception');
        }
    }

    delete_line(element: any) {
        try {
            this.spinner.show();
            var json = {
                GRNHeaderNo: this.inputjson.grn_no,
                GRNLineNo: element.grn_line_no,
                RejectionReason: element.rejection_reason,
                Barcode: element.barcode,
                Quantity: element.qty,
                Bincode: element.bincode,
                VendorLotNo: element.vendor_lot_no,
                ExpireDate: element.expire_date
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.IQCDeleteLine, json).then(
                result => {
                    if (result[0].header[0].condition == 'True') {
                        this.iqc = result as IQC[];
                        if (this.iqc[0].lines[0].condition == 'True') {
                            this.dataSource = new MatTableDataSource<IQCLine>(this.iqc[0].lines);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                        } else {
                            this.dataSource = new MatTableDataSource<IQCLine>([]);
                        }
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


    complete_iqc() {
        try {
            this.spinner.show();
            var json = {
                GRNHeaderNo: this.inputjson.grn_no
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.IQCComplete, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this._toster.success(result[0].message, 'Success');
                        this.router.navigateByUrl('/inbound/iqclist');
                    } else {
                        this._toster.error(result[0].message, 'Error');
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


    show_all_barcode() {
        const dialog = this.composedilog.open(IqcbarcodelistComponent, {
            width: "600px",
            data: this.inputjson.grn_no
        });
    }

    scanbincode() {
        try {
            this.spinner.show();
            var json = {
                Bincode: this.bincode.value,
                LocationId: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.IQCScanBincode, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        document.getElementById('barcode').focus();
                    } else {
                        this.bincode.setValue('');
                        this._toster.error(result[0].message, 'Error');
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
