import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import * as FileSaver from 'file-saver';
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'ReprintInvoiceMaster',
    templateUrl: './ReprintInvoiceMaster.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./ReprintInvoiceMaster.component.scss']
})
export class ReprintInvoiceMasterComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean = false;

    constructor(private validateResponse: ValidateResponse,
                private sessionManageMent: SessionManageMent,
                private _webapiHttp: WebApiHttp,
                private pristineToaster: ToastrService) {

    }

    ngOnInit() {

    }

    getPickInfoFromServer(pick_no: string) {
        this.loading = true;
        this._webapiHttp.Get_Data_With_DownloadStatus_GetFile(this._webapiHttp.ApiURLArray.OutboundQualityCheck_reprintReport + pick_no + '&action=Reprint')
            .subscribe((event: HttpEvent<any>) => {
                    try {
                        switch (event.type) {
                            case HttpEventType.Sent:
                                //   console.log('Request started');
                                //  this.showToast(this.types[2], this.types[2], 'Download Started');
                                break;
                            case HttpEventType.ResponseHeader:
                                //  console.log('Headers received ->', event.headers);
                                break;
                            case HttpEventType.DownloadProgress:
                                //  this.downloadeskb = Math.round(event.loaded / 1024);
                                //this.totalsizeDowloadFile = Math.round(event.total / 1024);
                                //  this.downloadValue = Math.ceil(Math.round((event.loaded / 1024) * 100) / this.totalsizeDowloadFile);
                                //  console.log(`Downloading ${ this.downloadValue} kb downloaded ${ this.totalsizeDowloadFile}`);
                                break;
                            case HttpEventType.Response:
                                //  console.log('Finished -> ', event.body);
                                if (event.body.type == "application/pdf") {
                                    this.downloadFile(event.body);
                                    FileSaver.saveAs(event.body, pick_no + '_Report.pdf');
                                    this.loading = false;
                                } else if (event.body.type == "application/json") {
                                    const blb = new Blob([event.body], {type: "text/plain"});
                                    var jsonresult = JSON.parse(this._webapiHttp.blobToString(blb));
                                    if (jsonresult[0].condition.toUpperCase() == "FALSE") {
                                        this.pristineToaster.error(jsonresult[0].message, "Error")
                                    }
                                    this.loading = false;
                                }
                                break;
                        }
                    } catch (e) {
                        this.loading = false;
                        console.log(e);
                    }
                }, error => {
                    this.loading = false;
                    console.log(error)
                }
            );
    }

    downloadFile(data) {
        const blob = new Blob([data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
    }
}


