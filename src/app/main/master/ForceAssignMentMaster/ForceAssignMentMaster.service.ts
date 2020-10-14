import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {isArray} from "rxjs/internal-compatibility";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {ForceAssignmentModel} from "../../../modal/ForceAssignmentModel";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {AllPickerModel} from "../../../modal/ShiftModel";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ForceAssignMentMasterService implements Resolve<any> {
    AllforceAssignmentList: Array<ForceAssignmentModel>;
    allPicker: Array<AllPickerModel>;

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
            Promise.all([this.getPickerEmail()]).then(
                ([pickerlist]) => {
                    this.allPicker = pickerlist;
                    this.AllforceAssignmentList = [];
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

    getPickInfoFromServer(pick_no: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.WebApiHttp.Post(this.WebApiHttp.ApiURLArray.PickInfoForForceAssigment, {
                PickNo: pick_no,
                WorkType: this.sessionManageMent.getWorkType,
                LocationId: this.sessionManageMent.getLocationId
            }).then(result => {
                if (isArray(result)) {
                    if (this._validateResponse.checkArrayResponseCondition(result) == true) {
                        this.AllforceAssignmentList = result;
                    } else {
                        this._toster.error(result[0].message, "Error");
                    }
                } else {
                    this._toster.error(result.message, "Error");
                }
                resolve();
            }, reject).catch(err => reject(err));
        });
    }

    getPickerEmail(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.allUser + 'Picker' + "&worktype=" +
                this.sessionManageMent.getWorkType + "&location_id=" + this.sessionManageMent.getLocationId).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }
}
