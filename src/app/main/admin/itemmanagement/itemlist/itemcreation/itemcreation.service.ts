import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {BaseUomCodeModel, categorymodel, GstGroupIdModel, GstHsnCodeModel} from "./itemcreationmodel";

@Injectable({
    providedIn: 'root'
})
export class ItemcreationService {
    ItemCategoryList: Array<categorymodel> = []
    GetGstGroupId: Array<GstGroupIdModel> = []
    GetGstHsnCode: Array<GstHsnCodeModel> = []
    GetBaseUom: Array<BaseUomCodeModel> = []

    constructor(private webApiHttp: WebApiHttp) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        return new Promise(((resolve, reject) => {
            Promise.all([ this.GstGroupId(), this.BaseUomValue()]).then(([ gstGroupId, baseuom]) => {
                this.GetGstGroupId = gstGroupId;
                this.GetBaseUom = baseuom
                resolve();
            }, reject).catch(err => {
                reject(err);
            })

        }))
    }

    // CatagoryList(): Promise<any> {
    //     return new Promise<any>(((resolve, reject) => {
    //         this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemCategoryListWithSeedType)
    //             .then(result => resolve(result), reject).catch(error => reject(error));
    //     }))
    // }

    GstGroupId(): Promise<any> {
        return new Promise<any>(((resolve, reject) => {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetGstGroupId)
                .then(result => resolve(result), reject).catch(error => reject(error));
        }))
    }

    BaseUomValue(): Promise<any> {
        return new Promise<any>(((resolve, reject) => {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetBaseUomValue)
                .then(result => resolve(result), reject).catch(error => reject(error));
        }))
    }
}
