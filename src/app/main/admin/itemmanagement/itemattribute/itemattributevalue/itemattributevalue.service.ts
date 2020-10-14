import {Injectable} from '@angular/core';
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";


@Injectable({
    providedIn: 'root'
})
export class ItemattributevalueService {
    constructor(private webApiHttp: WebApiHttp) {
    }


}
