import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {WaveWiseZoneModel} from "../../../../modal/WaveWiseZoneModel";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ExcelService} from "../../../../../@pristine/process/excel.Service";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";


@Injectable()
export class WaveWiseZoneService implements Resolve<any> {
    WaveWiseZoneActivity = new BehaviorSubject<Array<WaveWiseZoneModel>>(null);

    constructor(
        public  WebApiHttp: WebApiHttp,
        public validateResponse: ValidateResponse,
        public pristineToaster: ToastrService,
        public sessionManageMent: SessionManageMent,
        public excelService: ExcelService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getWaveWiseZoneActivity(this.WebApiHttp.ApiURLArray.WaveWiseZoneActivity + this.sessionManageMent.getEmail)
            ]).then(
                ([WaveWiseZoneActivity]) => {
                    if (this.validateResponse.checkArray(WaveWiseZoneActivity)) {
                        this.WaveWiseZoneActivity.next(WaveWiseZoneActivity);
                    } else {
                        this.pristineToaster.error('Error', 'Record Not Found.');
                    }
                    resolve();
                },
                reject
            );
        });
    }

    getWaveWiseZoneActivity(url): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(url).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }


    ExportToExcel(data, filename) {
        this.excelService.exportAsSlotInfoReport(data.table, data.table1, filename);

    }
}
