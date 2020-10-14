import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl} from "@angular/forms";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Manifest_postingService} from "./manifest_posting.service";
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {manifest_Ship_DataModel, manifestDataModel, ShippingOrderModel} from "../../../modal/ManifestPostingModel";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'manifest_posting',
    templateUrl: './manifest_posting.component.html',
    styleUrls: ['./manifest_posting.component.scss']
})
export class Manifest_postingComponent implements OnInit {
    shippingPartner: FormControl = new FormControl();
    ShippingOrder: Array<ShippingOrderModel> = [];
    manifestShipData: Array<manifest_Ship_DataModel> = [];
    manifestData: Array<manifestDataModel> = [];
    dataSource: MatTableDataSource<manifestDataModel>;
    searchByname: string = '';
    displayedColumns: string[] = ['manifest_no', 'sub_manifest_no', 'ship_agent_code', 'awb_no', 'web_order_no', 'cancelled'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    Showtable: boolean = false;
    showGetOrder: boolean = false;

    constructor(private validateResponse: ValidateResponse,
                public sessionManageMent: SessionManageMent,
                private encryptdecrypt: EncriptDecript,
                public ManifestPostingService: Manifest_postingService,
                private pristineToaster: ToastrService,
                private webApiHttp: WebApiHttp) {
        this.ShippingOrder = ManifestPostingService.ShippingOrder;
        this.manifestShipData = ManifestPostingService.manifestShipData;
        this.manifestData = ManifestPostingService.manifestData;

        this.dataSource = new MatTableDataSource<manifestDataModel>(ManifestPostingService.manifestData);
    }

    ngOnInit() {
        this.ManifestPostingService.Showtable.subscribe(result => {
            this.Showtable = result;
        });
        this.ManifestPostingService.showGetOrder.subscribe(result => {
            this.showGetOrder = result;
        });
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    GetOrder() {
        if (this.shippingPartner.value == '' || this.shippingPartner.value == null || this.shippingPartner.value == undefined) {
            this.pristineToaster.info('Please select shipping partner', 'info')
        } else {
            const json = {
                ship_agent_code: this.shippingPartner.value,
                created_by: this.sessionManageMent.getEmail,
                location_id: this.sessionManageMent.getLocationId
            };
            try {
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateManifest, json)
                    .then(result => {
                        let response: Array<{ condition: string, message: string }> = result.manifest_Data;
                        if (response[0].condition.toLowerCase() == 'true') {
                            this.dataSource = new MatTableDataSource<manifestDataModel>(result.manifest_Data);
                            this.manifestShipData = result.manifest_Ship_Data;
                            this.manifestData = result.manifest_Data;
                            this.Showtable = true;
                            this.showGetOrder = true;
                        } else {
                            this.pristineToaster.error(response[0].message, 'error');
                            this.Showtable = false;

                            this.shippingPartner.setValue('')
                        }
                    }, error => {
                        console.log(error)
                    })
            } catch (e) {
                console.log(e);
            }
        }

    }

    manifestCreated() {
        const json = {
            manifest_no: this.dataSource.data[0].manifest_no,
            created_by: this.sessionManageMent.getEmail,
            location_id: this.sessionManageMent.getLocationId
        };
        try {
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.MarkedCreated, json)
                .then(result => {
                    let response: Array<{ condition: string, message: string }> = result;
                    if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
                        this.pristineToaster.success(response[0].message, 'Success');
                        this.showGetOrder = false;
                        this.Showtable = false;
                        this.shippingPartner.setValue('')
                    } else {
                        this.pristineToaster.error(response[0].message, 'error');
                        this.shippingPartner.setValue('')
                    }
                }, error => {
                    console.log(error)
                })

        } catch (e) {
            console.log(e)
        }
    }

    manifestRelease() {
        const json = {
            manifest_no: this.dataSource.data[0].manifest_no,
            created_by: this.sessionManageMent.getEmail,
            location_id: this.sessionManageMent.getLocationId
        };
        try {
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.MarkedRelease, json)
                .then(result => {
                    let response: Array<{ condition: string, message: string }> = result;
                    if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
                        this.pristineToaster.success(response[0].message, 'Success');
                        this.showGetOrder = false;
                        this.Showtable = false;
                        this.shippingPartner.setValue('')
                    } else {
                        this.pristineToaster.error(response[0].message, 'error');
                        this.shippingPartner.setValue('')
                    }
                }, error => {
                    console.log(error)
                })
        } catch (e) {
            console.log(e)
        }
    }

    downloadExcel() {
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.excel_ReportManifestPost + this.sessionManageMent.getLocationId).then(result => {
            this.ManifestPostingService.ExportToExcel(this.manifestData, result, 'PostedManifetsReport')
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
}

