import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";


@Injectable()
export class ReprintInvoiceMasterService implements Resolve<any> {

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
}
