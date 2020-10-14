import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AllPickerModel, PickZoneModel, RosterSubmitHitModel} from "../../../modal/ShiftModel";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";


@Injectable()
export class RoasterMasterService implements Resolve<any> {
    allPickZone = new BehaviorSubject<Array<PickZoneModel>>(null);
    allPicker = new BehaviorSubject<Array<AllPickerModel>>(null);
    getDefaultRoaster: Array<RosterSubmitHitModel> = [];

    //todo moment List;
    movementList: Array<{ picker_email: string, zone: string }> = [];
    by_usermovement: Array<{ picker_email: string, zone: string }> = [];
    ZonePickCombination: Array<{ id: number, zone: string, picker: Array<{ picker_id: string, active: number }> }> = [];

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
                this.getPickZone(), this.getPickerEmail(), this.getAllDefaultRoaster()
            ]).then(
                ([allPickZone, AllPickerEmail, getAllDefaultRoaster]) => {
                    //todo end allshift
                    this.allPickZone.next(allPickZone);

                    if (this._validateResponse.checkArrayResponseCondition(AllPickerEmail) == true)
                        this.allPicker.next(AllPickerEmail);
                    else
                        this._toster.error(AllPickerEmail[0].message, 'Error');
                    this.validateAllDefaultRoaster(getAllDefaultRoaster);
                    resolve();
                },
                reject
            ).catch(err => {
                reject(err)
            });
        });
    }

    getAllDefaultRoaster(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.allRoster + this.sessionManageMent.getEmail + '&location_id=' + this.sessionManageMent.getLocationId).then(result => {
                resolve(result)
            }, reject).catch(error => reject(error));
        });
    }

    validateAllDefaultRoaster(result: Array<RosterSubmitHitModel>) {
        if (this._validateResponse.checkArrayResponseCondition(result) == true) {
            this.getDefaultRoaster = result;
            this.movementList = [];
            for (let i = 0; i < this.getDefaultRoaster.length; i++) {
                var zone = this.getDefaultRoaster[i].zone;
                for (let j = 0; j < this.getDefaultRoaster[i].picker.length; j++) {
                    this.movementList.push({
                        picker_email: this.getDefaultRoaster[i].picker[j].picker_id,
                        zone: zone
                    });
                }
            }
        } else {
            if (result.length > 0 && result[0].shift_name != null && result[0].shift_name != undefined && result[0].shift_name != '') {
                this.getDefaultRoaster = result;
            } else {
                this.getDefaultRoaster = [];
                this._toster.error(result[0].message, "Error");
            }
        }
    }

    getPickZone(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.pickZone).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    getPickerEmail(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.WebApiHttp.Get(this.WebApiHttp.ApiURLArray.allUser + 'Picker' + "&worktype=" + this.sessionManageMent.getWorkType + '&location_id=' + this.sessionManageMent.getLocationId).then(
                result => resolve(result), reject
            ).catch(error => reject(error));
        });
    }

    async resetPickZoneOrPicker() {
        await this.getPickZone().then(allPickZone => {
            this.allPickZone.next(allPickZone);
        });
        await this.getPickerEmail().then(allPicker => {
            this.allPicker.next(allPicker);
        });
    }
}
