import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Vendorcataloguemodel} from "./vendorcataloguemodel";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
    providedIn: 'root'
})
export class VendorcatalogueService implements Resolve<any> {
    CatalogueList: Array<Vendorcataloguemodel> = [];

    constructor(private webApiHttp: WebApiHttp, private spinner: NgxSpinnerService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        return new Promise(((resolve, reject) => {
            Promise.all([this.VendorCatalogueList()]).then(([vendorcatalogue]) => {
                this.CatalogueList = vendorcatalogue;
                resolve();
            }, reject).catch(err => {
                reject(err);
            })

        }))
    }

    VendorCatalogueList(): Promise<any> {
        return new Promise<any>(((resolve, reject) => {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.VendorCatalogueList)
                .then(result => resolve(result), reject).catch(error => reject(error));
        }))
    }

}