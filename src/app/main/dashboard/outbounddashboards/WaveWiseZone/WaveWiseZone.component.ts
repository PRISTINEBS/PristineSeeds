import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {pristineAnimations} from "../../../../../@pristine/animations";
import {WaveWiseZoneModel} from "../../../../modal/WaveWiseZoneModel";
import {WaveWiseZoneService} from "./WaveWiseZone.service";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";


@Component({
    selector: 'WaveWiseZone',
    templateUrl: './WaveWiseZone.component.html',
    styleUrls: ['./WaveWiseZone.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: pristineAnimations
})
export class WaveWiseZoneComponent implements OnInit {
    WaveWiseZoneActivity: Array<WaveWiseZoneModel> = [];

    constructor(private webApiHttp: WebApiHttp, private validateResponse: ValidateResponse,
                public waveWiseZoneService: WaveWiseZoneService) {
    }

    ngOnInit(): void {
        this.waveWiseZoneService.WaveWiseZoneActivity.subscribe((result: Array<WaveWiseZoneModel>) => {
            if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
                this.WaveWiseZoneActivity = result;
            }
        })


    }
}


