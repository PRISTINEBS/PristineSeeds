import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {PriorityMasterModel, PriorityModel} from "../../../modal/PriorityModel";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";


@Injectable()
export class PriorityMasterService implements Resolve<any> {
    AllPickPriorityPickList: Array<PriorityModel>;
    AllProiorityPickMaster: Array<PriorityMasterModel>;

    constructor(
        private _toster: ToastrService,
        private WebApiHttp: WebApiHttp,
        private _validateResponse: ValidateResponse,
        public sessionManageMent: SessionManageMent
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
            Promise.all([
                this.getAllPickPriority(this.WebApiHttp.ApiURLArray.PickPriority + this.sessionManageMent.getWorkType + '&location_id=' + this.sessionManageMent.getLocationId), this.getAllPickPriority(this.WebApiHttp.ApiURLArray.PriorityListMaster)
            ]).then(
                ([AllPickPriorityPickList, AllProiorityPickMaster]) => {
                    //todo allshift
                    if (this._validateResponse.checkArray(AllPickPriorityPickList)) {
                        if (this._validateResponse.checkArrayResponseCondition<PriorityModel>(AllPickPriorityPickList) == true) {
                            this.AllPickPriorityPickList = AllPickPriorityPickList;
                        } else {
                            this._toster.error(AllPickPriorityPickList[0].message, 'Error');
                        }
                    } else {
                        if (this._validateResponse.checkObjectResponseCondition(AllPickPriorityPickList) == false)
                            this._toster.error(AllPickPriorityPickList.message, 'Error');
                    }
                    this.AllProiorityPickMaster = AllProiorityPickMaster;
                    resolve();
                },
                reject
            ).catch(err => {
                reject(err)
            });
        });
    }

    getAllPickPriority(url): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(url).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    updatePickLine(url: string, postedjson: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Post(url, postedjson).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }
}
