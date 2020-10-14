import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {CageZoneList} from "../../../modal/CageMasterModel";


@Injectable()
export class CageMasterService implements Resolve<any> {
    cageList = new BehaviorSubject<any>(null);
    cagZoneList = new BehaviorSubject<Array<CageZoneList>>(null);

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
                this.getAllPickTray(this.WebApiHttp.ApiURLArray.CageList + this.sessionManageMent.getLocationId),
                this.getAllPickTray(this.WebApiHttp.ApiURLArray.cage_ZoneList + this.sessionManageMent.getLocationId)
            ]).then(
                ([AllTrayList, cage_ZoneList]) => {
                    //todo allshift
                    this.cageList.next(AllTrayList);
                    this.cagZoneList.next(cage_ZoneList);
                    resolve();
                },
                reject
            ).catch(err => {
                reject(err)
            });
        });
    }

    getAllPickTray(url): Promise<any> {
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
