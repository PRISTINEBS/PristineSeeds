import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from "@angular/material/dialog";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {PristineConfirmDialogInputComponent} from "../../../../@pristine/components/confirm-dialog-input/confirm-dialog-input.component";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {
    createHandoverData,
    HandoverLineModel,
    PendingShippingManifestNo,
    ShippingOrderModel
} from "../../../modal/ManifestPostingModel";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {FormControl} from "@angular/forms";
import {PromiseResponse} from "../../../modal/PromiseResponse";
import {ToastrService} from "ngx-toastr";
import * as FileSaver from 'file-saver';

@Component({
    selector: 'manifest_posting',
    templateUrl: './ManifestHandOver.component.html',
    styleUrls: ['./ManifestHandOver.component.scss']
})
export class ManifestHandOverComponent implements OnInit {
    shippingPartner: FormControl = new FormControl();
    pendingDocNo: FormControl = new FormControl();
    vehicle_no: FormControl = new FormControl();
    ShippingOrder: Array<ShippingOrderModel> = [];
    dataSource: MatTableDataSource<HandoverLineModel>;
    getPendingShippingNo: Array<PendingShippingManifestNo> = [];
    handoverLineDetail: Array<HandoverLineModel> = [];
    selectAll: boolean = true;
    showTableData: boolean = false;
    rowcount: number = 0;
    searchByname: string = '';

    displayedColumns: string[] = ['manifest_no', 'sub_manifest_no', 'ship_agent_code', 'awb_no', 'web_order_no', 'cancelled', 'Selected_Item'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    selected_OrNot: boolean = false;
    tempselect: Array<string> = [];
    loading: boolean = false;

    constructor(private validateResponse: ValidateResponse,
                public sessionManageMent: SessionManageMent,
                private encryptdecrypt: EncriptDecript,
                public composeDialog: MatDialog,
                private pristineToaster: ToastrService,
                private webApiHttp: WebApiHttp) {
        this.dataSource = new MatTableDataSource<HandoverLineModel>([]);
    }

    applyFilter(filterValue: string, keyName: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toUpperCase();
        this.dataSource.filter = filterValue;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
            if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
                return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
            } else {
                return false
            }
        };
    }

    ngOnInit() {
        try {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.SelectShippingOrder)
                .then(result => {
                    if (result.length > 0) {
                        this.ShippingOrder = result as ShippingOrderModel[];

                    } else {
                        this.pristineToaster.error('No data found', 'error')
                    }
                }, error => {
                    console.log(error)
                })
        } catch (e) {
            console.log(e);
        }
    }

    GetPendingShippingManifestNo() {
        let shippingAgentName = this.shippingPartner.value;
        this.pendingDocNo.setValue([]);
        this.showTableData = false;
        try {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetPendingShippingManifestNo + shippingAgentName + '&location_id=' + this.sessionManageMent.getLocationId)
                .then(result => {
                    let response: Array<{ condition: string; message: string }> = result;
                    if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
                        this.getPendingShippingNo = result as PendingShippingManifestNo[]
                    } else {
                        this.pristineToaster.error('Pending Doc No Not Found For ' + '' + this.shippingPartner.value, 'error');
                        this.getPendingShippingNo.splice(0, this.getPendingShippingNo.length);
                        this.pendingDocNo.setValue([]);
                    }
                }, error => {
                    console.log(error)
                })
        } catch (e) {
            console.log(e);
        }

    }

    selectAllForUser(event) {
        this.selected_OrNot = !this.selected_OrNot;
        if (this.selected_OrNot) {
            this.tempselect = [];
            for (var i = 0; i < this.getPendingShippingNo.length; i++) {
                this.tempselect.push(this.getPendingShippingNo[i].sub_manifest_no);
            }
        } else {
            this.tempselect = [];
        }
        this.tempselect.push(this.selected_OrNot ? '0' : '');
        this.pendingDocNo.setValue(this.tempselect);
    }

    GetHandoverLine() {
        if (this.shippingPartner.value == '' || this.shippingPartner.value == null || this.shippingPartner.value == undefined) {
            this.pristineToaster.info('Please select shipping agent', 'info')
        } else if (this.pendingDocNo.value == '' || this.pendingDocNo.value == null || this.pendingDocNo.value == undefined) {
            this.pristineToaster.info('Please select pending doc', 'info')

        } else {
            const json = {
                ship_agent_code: this.shippingPartner.value,
                sub_manifest_no: this.pendingDocNo.value,
                LocationId: this.sessionManageMent.getLocationId
            };
            try {
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.getManifestHandoverLine, json)
                    .then(result => {
                        this.handoverLineDetail = result as HandoverLineModel[];
                        if (this.handoverLineDetail.length > 0 && this.handoverLineDetail[0].condition.toLowerCase() == 'true') {
                            this.dataSource = new MatTableDataSource<HandoverLineModel>(this.handoverLineDetail);
                            this.onSelectAll();
                            this.showTableData = true;
                        } else {

                        }
                    }, error => {
                        console.log(error);
                    })
            } catch (e) {
                console.log(e);
            }
        }


    }

    CreateManifestHandover() {
        if (this.vehicle_no.value != "" && this.vehicle_no.value != null && this.vehicle_no.value != undefined) {
            if (this.loading == false) {
                this.loading = true;
                let tempDataArray: Array<createHandoverData> = [];
                tempDataArray = [];
                for (let i = 0; i < this.dataSource.data.length; i++) {
                    if (this.dataSource.data[i].select_byuser == true) {
                        tempDataArray.push({
                            manifest_no: this.dataSource.data[i].manifest_no,
                            sub_manifest_no: this.dataSource.data[i].sub_manifest_no,
                            sub_manifest_line_no: this.dataSource.data[i].sub_manifest_line_no,
                            web_order_no: this.dataSource.data[i].web_order_no,
                            awb_no: this.dataSource.data[i].awb_no,
                            ship_agent_code: this.dataSource.data[i].ship_agent_code,
                            created_by: this.sessionManageMent.getEmail,
                            vehicle_no: this.vehicle_no.value
                        })
                    }
                }
                if (tempDataArray.length == 0) {
                    this.pristineToaster.error('Select Atleast one row for Handover', 'Error');
                    this.loading = false;
                    return;
                }
                const json = {
                    handover_Line: tempDataArray,
                    location_id: this.sessionManageMent.getLocationId
                };
                try {
                    this.webApiHttp.Post_Data_GetFile(this.webApiHttp.ApiURLArray.CreateManifestHandover, json)
                        .subscribe((event: HttpEvent<any>) => {
                            try {
                                switch (event.type) {
                                    case HttpEventType.Sent:
                                        break;
                                    case HttpEventType.ResponseHeader:
                                        break;
                                    case HttpEventType.DownloadProgress:
                                        break;
                                    case HttpEventType.Response:
                                        if (event.body.type == "application/pdf") {
                                            this.pristineToaster.success('Handover created', 'success');
                                            this.showTableData = false;
                                            this.shippingPartner.setValue('');
                                            this.pendingDocNo.setValue('');
                                            this.vehicle_no.setValue('');
                                            this.selectAll = true;
                                            FileSaver.saveAs(event.body, 'ManifestHandOver_Report.pdf');
                                            this.downloadFile(event.body);
                                            this.loading = false;
                                        } else if (event.body.type == "application/json") {
                                            const blb = new Blob([event.body], {type: "text/plain"});
                                            var jsonresult = JSON.parse(this.webApiHttp.blobToString(blb));
                                            if (jsonresult[0].condition.toUpperCase() == "FALSE") {
                                                this.pristineToaster.error(jsonresult[0].message, "Error");
                                            }
                                            this.loading = false;
                                        }
                                        break;
                                }
                            } catch (e) {
                                console.log(e);
                                this.loading = false;
                            }
                        }, error => {
                            this.loading = false;
                            console.log(error)
                        })
                } catch (e) {
                    console.log(e);
                    this.loading = false;
                }
            }
        } else {
            this.pristineToaster.error('Error', 'Please Enter Vehicle No.')
        }
    }

    downloadFile(data) {
        const blob = new Blob([data], {type: 'application/pdf'});
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = window.URL.createObjectURL(blob);
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
    }

    onSelectAll() {
        this.rowcount = 0;
        for (let i = 0; i < this.dataSource.data.length; i++) {
            this.dataSource.data[i].select_byuser = this.selectAll;
            if (this.dataSource.data[i].select_byuser == true) {
                this.rowcount = this.rowcount + 1;
            } else {
                this.rowcount = 0;
            }
        }
    }

    selectRowCheckBox(event, index) {
        for (let i = 0; i < this.dataSource.data.length; i++) {
            if (this.dataSource.data[i].select_byuser == false) {
                this.selectAll = false
                break;
            } else if (this.dataSource.data[i].select_byuser != false) {
                this.selectAll = true
            }
        }
        if (this.dataSource.data[index].select_byuser == false) {
            this.rowcount = this.rowcount - 1;
        } else {
            this.rowcount = this.rowcount + 1;
        }
    }

    ReprintHandover() {
        const dialogRef = this.composeDialog.open(PristineConfirmDialogInputComponent);
        dialogRef.componentInstance.confirmMessage = 'Reprint Report';
        dialogRef.componentInstance.inputFieldMessage = 'Enter Handover No.';
        dialogRef.componentInstance.addbutton = 'OK';
        dialogRef.afterClosed().subscribe((result: PromiseResponse) => {
            if (result.condition == 'true') {
                this.webApiHttp.Get_Data_With_DownloadStatus_GetFile(this.webApiHttp.ApiURLArray.Handover_reprint + result.message).subscribe((event: HttpEvent<any>) => {
                    try {
                        switch (event.type) {
                            case HttpEventType.Sent:
                                break;
                            case HttpEventType.ResponseHeader:
                                break;
                            case HttpEventType.DownloadProgress:
                                break;
                            case HttpEventType.Response:
                                if (event.body.type == "application/pdf") {
                                    this.pristineToaster.success('Handover Reprint Success.', 'success');
                                    this.showTableData = false;
                                    this.shippingPartner.setValue('');
                                    this.pendingDocNo.setValue('');
                                    this.selectAll = true;
                                    FileSaver.saveAs(event.body, 'ManifestHandOver_Report.pdf');
                                    this.downloadFile(event.body);

                                } else if (event.body.type == "application/json") {
                                    const blb = new Blob([event.body], {type: "text/plain"});
                                    var jsonresult = JSON.parse(this.webApiHttp.blobToString(blb));
                                    if (jsonresult[0].condition.toUpperCase() == "FALSE") {
                                        this.pristineToaster.error(jsonresult[0].message, "Error");
                                    }
                                }
                                break;
                        }

                        this.loading = false;
                    } catch (e) {
                        console.log(e);
                        this.loading = false;
                    }
                }, error => {
                    this.loading = false;
                    console.log(error)
                });
            }
        });
    }
}

