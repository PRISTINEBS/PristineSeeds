import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class PickInfoReportService implements Resolve<any> {
    constructor(
        private _toster: ToastrService,
        private WebApiHttp: WebApiHttp,
        private _validateResponse: ValidateResponse,
        public sessionManageMent: SessionManageMent,
        private excelService: ExcelService
    ) {
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([]).then(
                ([]) => {
                    resolve();
                },
                reject
            ).catch(err => {
                reject(err)
            });
        });
    }

    getPickInfoFromServer(pickno: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.PickInfoReport + pickno).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    ExportToExcel(data: any, filename) {
        /*      data.then(result => {
                  for (var i = 0; i < result.length; i++) {
                      delete result[i].condition;
                  }

              })*/
        this.excelService.exportAsExcelFile(data, filename);
    }
}
