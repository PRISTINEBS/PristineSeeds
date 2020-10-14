import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Vendorlistmodel} from "./vendorlistmodel";

@Injectable({
    providedIn: 'root'
})
export class VendorlistService implements Resolve<any> {

    VendorList: Array<Vendorlistmodel> = [];

    constructor(private webApiHttp: WebApiHttp) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        return new Promise(((resolve, reject) => {
            Promise.all([this.GetAllVendorList()]).then(([vendorlist]) => {
                this.VendorList = vendorlist;
                resolve();

            }, reject).catch(err => {
                reject(err)
            })

        }))
    }

    GetAllVendorList(): Promise<any> {
        return new Promise<any>(((resolve, reject) => {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetAllVendorList)
                .then(result => resolve(result), reject).catch(error => reject(error));
        }))
    }
}