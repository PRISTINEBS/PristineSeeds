import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import {isArray} from "rxjs/internal-compatibility";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {PickDistributionReportMOdel} from "../../../modal/ReportModel";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {ToastrService} from "ngx-toastr";


@Injectable()
export class PickDistributionReportService implements Resolve<any> {
    PickDistribution_list: Array<PickDistributionReportMOdel>;

    constructor(
        private _toster: ToastrService,
        private WebApiHttp: WebApiHttp,
        private _validateResponse: ValidateResponse,
        public sessionManageMent: SessionManageMent,
        private excelService: ExcelService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([this.getPickDistributionFromServer()]).then(
                ([PickDistribution]) => {
                    if (isArray(PickDistribution)) {
                        if (this._validateResponse.checkArrayResponseCondition(PickDistribution) == true) {
                            this.PickDistribution_list = PickDistribution;
                        } else {
                            this._toster.error("Error", PickDistribution[0].message);
                            this.PickDistribution_list = [];
                        }
                    } else {
                        this._toster.error("Error", PickDistribution.message);
                        this.PickDistribution_list = [];
                    }
                    resolve();
                },
                reject
            ).catch(err => {
                reject(err)
            });
        });
    }

    getPickDistributionFromServer(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.PickDistribution).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    ExportToExcel(data: Array<PickDistributionReportMOdel>, filename) {
        for (var i = 0; i < data.length; i++) {
            delete data[i].condition;
        }
        this.excelService.exportAsExcelFile(data, filename);
    }
}
