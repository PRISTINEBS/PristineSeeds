import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {ManagerRosterModel, ShiftModel} from "../../../modal/ShiftModel";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ShiftMasterService implements Resolve<any> {
    AllShift: Array<ShiftModel>;
    allSupervisor: Array<{ email: string }>;
    AllManagerRosterList: Array<ManagerRosterModel>;

    //todo endMovement
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
                this.getallShift(), this.getallSupervisor(), this.getManagerRosterData()
            ]).then(
                ([allshift, allSupervisor, managerRoaster]) => {
                    //todo allshift
                    if (this._validateResponse.checkArray(allshift)) {
                        if (this._validateResponse.checkArrayResponseCondition<ShiftModel>(allshift) == true) {
                            this.AllShift = allshift;
                        } else {
                            this._toster.error(allshift[0].message, 'Error');
                        }
                    } else {
                        if (this._validateResponse.checkObjectResponseCondition(allshift) == false)
                            this._toster.error(allshift.message, 'Error');
                    }
                    //todo end allshift
                    this.allSupervisor = allSupervisor;
                    if (this._validateResponse.checkArrayResponseCondition(managerRoaster) == true) {
                        this.AllManagerRosterList = managerRoaster;
                    }
                    resolve();
                },
                reject
            ).catch(err => {
                reject(err)
            });
        });
    }

    getManagerRosterData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.ManagerDataRoster + this.sessionManageMent.getLocationId).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    getallShift(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.allShift + this.sessionManageMent.getLocationId).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    getallSupervisor(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.allUser + 'supervisor&worktype=All&location_id=' + this.sessionManageMent.getLocationId).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }
}
