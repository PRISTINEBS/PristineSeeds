import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {isArray} from "rxjs/internal-compatibility";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {manifest_Ship_DataModel, manifestDataModel, ShippingOrderModel} from "../../../modal/ManifestPostingModel";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";


@Injectable()
export class Manifest_postingService implements Resolve<any> {
    ShippingOrder: Array<ShippingOrderModel> = [];
    manifestShipData: Array<manifest_Ship_DataModel>;
    manifestData: Array<manifestDataModel>;
    Showtable = new BehaviorSubject<boolean>(false);
    showGetOrder = new BehaviorSubject<boolean>(false);

    constructor(
        private WebApiHttp: WebApiHttp,
        private _validateResponse: ValidateResponse,
        public sessionManageMent: SessionManageMent,
        private excelService: ExcelService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([this.getAllShipmentDropdown(this.WebApiHttp.ApiURLArray.SelectShippingOrder),
                this.getPriviousAloocatedManifest(this.WebApiHttp.ApiURLArray.CreateManifest, {
                    ship_agent_code: '',
                    created_by: this.sessionManageMent.getEmail,
                    location_id: this.sessionManageMent.getLocationId
                })]).then(
                ([shipmentDropdown, CreateManifest]) => {
                    if (isArray(shipmentDropdown) && shipmentDropdown.length > 0) {
                        this.ShippingOrder = shipmentDropdown;
                        this.ShippingOrder.splice(0, 0, {
                            condition: 'true',
                            name: 'All',
                            code: 'All'
                        });

                        this.ShippingOrder.sort()
                    }
                    let response: Array<{ condition: string, message: string }> = CreateManifest.manifest_Data;
                    if (response[0].condition.toLowerCase() == 'true') {
                        this.manifestData = CreateManifest.manifest_Data;
                        this.manifestShipData = CreateManifest.manifest_Ship_Data;
                        this.Showtable.next(true);
                        this.showGetOrder.next(true);
                    } else {
                        this.manifestData = [];
                        this.manifestShipData = [];
                        this.Showtable.next(false);
                        this.showGetOrder.next(false);
                    }
                    resolve();
                },
                reject
            ).catch(err => {
                reject(err);
            });
        });
    };

    getAllShipmentDropdown(url): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(url).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    getPriviousAloocatedManifest(url, postedjson): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Post(url, postedjson).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    ExportToExcel(data: Array<manifestDataModel>, postedmenifestdata: any, filename) {

        for (var i = 0; i < data.length; i++) {
            delete data[i].condition;
        }
        this.excelService.exportAsSaleHeaderManifest(data, postedmenifestdata, filename);

    }
}
