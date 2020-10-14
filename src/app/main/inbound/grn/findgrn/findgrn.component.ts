import {MatIconRegistry} from "@angular/material/icon";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {DocumentInfo, Documentlist, Grnmodal} from "../grnmodal";
import {Component, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {DomSanitizer} from "@angular/platform-browser";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {NewgrndialogComponent} from "./newgrndialog/newgrndialog.component";

@Component({
    selector: 'app-grn',
    templateUrl: './findgrn.component.html',
    styleUrls: ['./findgrn.component.scss']
})
export class FindgrnComponent implements OnInit {
    documentType: string[] = ['Purchase Order', 'Inbound Transfer Order', 'Sales Return Order'];
    subdocumentType: string[] = ['Return to Origin', 'Customer Return'];
    displayedColumns: string[] = ['grn_no', 'grn_status', 'grn_created_by', 'grn_created_datetime', 'With Scan', 'Without Scan'];
    dataSource: MatTableDataSource<Grnmodal>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    subtype: boolean = true;

    find_grn: FormGroup;
    searchByDocumentNo: string = '';
    documentlist: Documentlist[];
    start: boolean = true;
    documentInfo: DocumentInfo[];
    vendor_name: any;
    ordered_qty: any;
    received_quantity: any;

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private _toster: ToastrService,
                private router: Router,
                private datePipe: DatePipe,
                private matIconRegistry: MatIconRegistry,
                private domSanitizer: DomSanitizer,
                private composedilog: MatDialog,
                private _encriptDecript: EncriptDecript,
                private spinner: NgxSpinnerService) {
        this.find_grn = _formBuilder.group({
            DocumentType: ['', Validators.required],
            DocumentNo: ['', Validators.required]
        });
        this.matIconRegistry.addSvgIcon(
            'scanner',
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/material-icons/scanner.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'input',
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/material-icons/input.svg'),
        );
    }


    ngOnInit(): void {

    }


    get_DocumentNo() {
        try {
            if (this.find_grn.get('DocumentType').value != 'Sales Return Order') {
                this.spinner.show();
                this.subtype = true;
                this.find_grn.removeControl('SubDocumentType');
                var json = {
                    LocationId: this.sessionManageMent.getLocationId,
                    DocumentType: this.find_grn.get('DocumentType').value,
                    Filter: this.searchByDocumentNo
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GRNactivedocumentno, json).then(
                    result => {
                        if (result[0].condition == 'True') {
                            this.documentlist = result as Documentlist[];
                        } else {
                            this.documentlist = [];
                            this.find_grn.get('DocumentNo').setValue('');
                            this._toster.info(result[0].message, 'Info');
                        }
                        this.spinner.hide();
                    }).catch(error => {
                    this._toster.error(error, 'Error');
                    this.spinner.hide();
                })
            } else {
                this.subtype = false;
                this.find_grn.addControl('SubDocumentType', new FormControl('', Validators.required));
            }
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }
    }

    get_subDocumentNo(value: any) {
        try {
            if (this.find_grn.get('DocumentType').value == 'Sales Return Order') {
                this.spinner.show();
                this.find_grn.get('SubDocumentType').setValue(value);
                var json = {
                    LocationId: this.sessionManageMent.getLocationId,
                    DocumentType: this.find_grn.get('SubDocumentType').value,
                    Filter: this.searchByDocumentNo
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GRNactivedocumentno, json).then(
                    result => {
                        if (result[0].condition == 'True') {
                            this.documentlist = result as Documentlist[];
                        } else {
                            this.documentlist = [];
                            this._toster.info(result[0].message, 'Info');

                        }
                        this.spinner.hide();
                    }).catch(error => {
                    this._toster.error(error, 'Error');
                    this.spinner.hide();
                })
            } else {
                this.subtype = true;
                this.find_grn.removeControl('SubDocumentType');

            }
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }
    }

    getdocument_full_info() {
        try {
            this.spinner.show();
            var doctype = ''
            if (this.find_grn.get('DocumentType').value == 'Sales Return Order') {
                doctype = this.find_grn.get('SubDocumentType').value
            } else {
                doctype = this.find_grn.get('DocumentType').value
            }
            var json = {
                LocationId: this.sessionManageMent.getLocationId,
                DocumentType: doctype,
                DocumentNo: this.find_grn.get('DocumentNo').value
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DocumentInfoForGRN, json).then(
                async result => {
                    if (result[0].documentData[0].condition == 'True') {
                        await this.set_table_tag_name();
                        this.start = false;
                        this.documentInfo = result as DocumentInfo[];
                        if (this.documentInfo[0].grnData[0].condition == 'True') {
                            this.dataSource = new MatTableDataSource<Grnmodal>(this.documentInfo[0].grnData);
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

    set_table_tag_name() {
        if (this.find_grn.get('DocumentType').value == 'Purchase Order') {
            this.vendor_name = 'Vendor Name';
            this.ordered_qty = 'Ordered Quantity';
            this.received_quantity = 'Received Quantity';
        } else if (this.find_grn.get('SubDocumentType').value == 'Return to Origin') {
            this.vendor_name = 'DSP Code';
            this.ordered_qty = 'Total AWB No';
            this.received_quantity = 'Completely Scanned AWB';
        } else if (this.find_grn.get('SubDocumentType').value == 'Customer Return') {
            this.vendor_name = 'Parent Invoice No';
            this.ordered_qty = 'Return Quantity';
            this.received_quantity = 'Return Type';
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

    async new_grn() {
        if (this.find_grn.get('DocumentType').value == 'Purchase Order' || this.find_grn.get('DocumentType').value == 'Inbound Transfer Order') {
            const dialog = this.composedilog.open(NewgrndialogComponent, {
                width: "750px",
                data: this.documentInfo[0].documentData[0].document_no
            });
            dialog.componentInstance.documenttype = this.find_grn.get('DocumentType').value;
            dialog.componentInstance.vendor_country = this.documentInfo[0].documentData[0].vendor_country;
            dialog.afterClosed().subscribe(
                async data => {
                    if (data != undefined && data.hasOwnProperty('GateEntryNo')) {
                        await this.create_new_grn(data);
                    }
                });
        } else {
            var json = {
                ExternalInvoiceNo: '',
                ExternalInvoiceDate: this.datePipe.transform(new Date(), 'MM-dd-yyyy'),
                BilofEntryAmount: 0.0,
                BilofEntryNo: '',
                BilofEntryDate: this.datePipe.transform(new Date(), 'MM-dd-yyyy'),
                CreatedBy: this.sessionManageMent.getEmail,
                GateEntryNo: '',
                DocumentType: this.find_grn.get('SubDocumentType').value,
                DocumentNo: this.documentInfo[0].documentData[0].document_no,
                grnway: 'Without Scan'
            }
            await this.create_new_grn(json);
        }
    }

    create_new_grn(data: any) {
        this.spinner.show();
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateGRNHeader, data).then(
            result => {
                if (result[0].condition == 'True') {
                    this.spinner.hide();
                    this.router.navigate(['/inbound/grnwithoutscanning',
                        {
                            response: this._encriptDecript.encrypt(JSON.stringify({
                                grn_header_no: result[0].grn_no,
                                type: data.grnway
                            }))
                        }]);
                } else {
                    this._toster.error(result[0].message, 'Error');
                }
                this.spinner.hide();
            }
        ).catch(error => {
            this.spinner.hide();
            this._toster.error(error, 'Error');
        })
    }

    startgrn(element: any, type: string) {
        this.router.navigate(['/inbound/grnwithoutscanning', {
            response: this._encriptDecript.encrypt(JSON.stringify({
                grn_header_no: element.grn_no,
                type: type
            }))
        }]);
    }

}
