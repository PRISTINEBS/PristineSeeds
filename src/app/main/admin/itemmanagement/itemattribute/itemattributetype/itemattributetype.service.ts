import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {itemattributetypemodel} from "./itemattributetypemodel";


@Injectable({
    providedIn: 'root'
})
export class ItemattributetypeService {
    ItemAttributeTypeList: Array<itemattributetypemodel> = []

    constructor(private webApiHttp: WebApiHttp) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        return new Promise(((resolve, reject) => {
            Promise.all([this.AttributeTypeList()]).then(([itemattrtypelist]) => {
                this.ItemAttributeTypeList = itemattrtypelist;
                resolve();
            }, reject).catch(err => {
                reject(err);
            })

        }))
    }

    AttributeTypeList(): Promise<any> {
        return new Promise<any>(((resolve, reject) => {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemAttributeTypelIst)
                .then(result => resolve(result), reject).catch(error => reject(error));
        }))
    }
}
