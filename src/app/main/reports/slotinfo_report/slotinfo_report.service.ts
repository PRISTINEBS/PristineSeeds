import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {SlotReport} from "../../../modal/SlotReport";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";


@Injectable()
export class Slotinfo_reportService implements Resolve<any> {
    zonelistTable = new BehaviorSubject<Array<SlotReport>>(null);

    constructor(
        public  WebApiHttp: WebApiHttp,
        public validateResponse: ValidateResponse,
        public pristineToaster: ToastrService,
        public excelService: ExcelService,
        public sessionManageMent: SessionManageMent,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getAllPickTray(this.WebApiHttp.ApiURLArray.slot_Report, {
                    flag: 'getAllZone',
                    LocationId: this.sessionManageMent.getLocationId
                })
            ]).then(
                ([slot_Report]) => {
                    if (this.validateResponse.checkArray(slot_Report) && this.validateResponse.checkArrayResponseCondition(slot_Report)) {
                        this.zonelistTable.next(slot_Report);
                    } else {
                        this.pristineToaster.error('Error', 'Record Not Found.');
                    }
                    resolve();
                },
                reject
            );
        });
    }

    getAllPickTray(url, json): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Post(url, json).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    getAll_Slot(url, json): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Post(url, json).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    GetSlotInfoData(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.Slotinfo_report).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        })
    }

    ExportToExcel(data, filename) {
        this.excelService.exportAsSlotInfoReport(data.table, data.table1, filename);

    }
}
