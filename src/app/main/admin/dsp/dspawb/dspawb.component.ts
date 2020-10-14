import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {pristineConfirmDialogComponent} from "../../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {Router} from "@angular/router";
import {ExcelService} from "../../../../../@pristine/process/excel.Service";
import {Dspawbmodel} from "./dspawbmodel";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {Observable} from "rxjs";
import {Component, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {pristineAnimations} from "../../../../../@pristine/animations";
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-dspawb',
    templateUrl: './dspawb.component.html',
    styleUrls: ['./dspawb.component.scss'],
    animations: pristineAnimations
})
export class DspawbComponent implements OnInit {
    dspPartnerList: Array<any>;
    searchDSP: string = '';
    paymentTypeList: Array<string> = ['COD', 'Prepaid', 'Credit'];
    pendingAWB: Array<any>;
    pageNo: number = 0
    error: boolean = false;
    findawb: FormGroup

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private router: Router,
                private _encriptDecript: EncriptDecript,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService,
                private  dialog: MatDialog,
                private fb: FormBuilder,
                private excelService: ExcelService) {
        this.findawb = this.fb.group({
            DSP: ['', Validators.required],
            PaymentType: ['', Validators.required]
        })
    }

    ngOnInit(): void {
        this.dsp_list();
    }

    dsp_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.DSPPartnerList + this.sessionManageMent.getLocationId + '&code=1').then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dspPartnerList = result
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.spinner.hide();
                    return;
                }
            ).catch(e => {
                this.spinner.hide();
                this._toster.error(e, 'Error');
            })
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Error');
        }
    }

    next() {
        if (this.pageNo >= 0) {
            this.pageNo += 1;
            this.awb_list();
        }
    }

    previous() {
        if (this.pageNo > 0) {
            this.pageNo -= 1;
            this.awb_list();
        }
    }

    awb_list() {
        try {
            this.spinner.show();
            const json = {
                LocationId: this.sessionManageMent.getLocationId,
                DSPCode: this.findawb.get('DSP').value,
                PaymentType: this.findawb.get('PaymentType').value,
                PageNo: this.pageNo
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DspAwb, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.pendingAWB = result;
                        if (result.length != 50)
                            this.error = true;
                        else
                            this.error = false;
                    } else {
                        this.error = true;
                        this.pageNo -= 1;
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.spinner.hide();
                }
            ).catch(e => {
                this.spinner.hide();
                this._toster.error(e, 'Error');
            })
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Error');
        }
    }

    downloadsamplefile() {
        this.excelService.exportAsExcelFile
        ([{AWBNo: ''}], this.findawb.get('DSP').value + this.findawb.get('PaymentType').value);
    }

    File_upload_To_Server() {
        var input_element: any = document.createElement("input");
        input_element.setAttribute("type", "file");
        input_element.click();
        input_element.addEventListener("change", event => {
            var file = event.target.files[0];
            var arrayBuffer: any;
            if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                || file.type == 'application/vnd.ms-excel') {
                var subscriberOfobservable = new Observable(observable => {
                    try {
                        let fileReader = new FileReader();
                        fileReader.onload = (e) => {
                            arrayBuffer = fileReader.result;
                            var data = new Uint8Array(arrayBuffer);
                            var arr = [];
                            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                            var bstr = arr.join("");
                            var workbook = XLSX.read(bstr, {type: "binary"});
                            var first_sheet_name = workbook.SheetNames[0];
                            var worksheet = workbook.Sheets[first_sheet_name];
                            let uploadedData: Array<Dspawbmodel> = XLSX.utils.sheet_to_json(worksheet, {raw: true});
                            this.upload_to_the_server(uploadedData);
                        };
                        fileReader.readAsArrayBuffer(file);

                    } catch (error) {
                        console.log(error);
                        this._toster.error('File is Not Readable', "Error");
                    }
                });
                subscriberOfobservable.subscribe(result => {
                    console.log("result", result);
                    input_element.remove();
                })
            } else {
                this._toster.error('Please Select only Excel file', "Error");
            }
        });


    }

    upload_to_the_server(data: Array<Dspawbmodel>) {
        var dialog = this.dialog.open(pristineConfirmDialogComponent)
        dialog.componentInstance.confirmMessage = 'Are you sure to upload AWB No.'
        dialog.afterClosed().subscribe(result => {
            if (result == true) {
                this.spinner.show();
                const json = {
                    LocationId: this.sessionManageMent.getLocationId,
                    DSPCode: this.findawb.get('DSP').value,
                    PaymentType: this.findawb.get('PaymentType').value,
                    AWBNo: data
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.UploadAWB, json).then((resul: Array<{
                    condition: string;
                    message: string;
                }>) => {
                    if (resul.length > 0 && resul[0].condition.toLowerCase() == 'true') {
                        this._toster.success("Success", resul[0].message);
                    } else
                        this._toster.error("Error", resul[0].message);
                    this.findawb.reset();
                    this.spinner.hide();
                }).catch(err => {
                    this.spinner.hide();
                    this._toster.error("Error", "Record Not Uploaded.")
                })
            }
        });
    }
}
