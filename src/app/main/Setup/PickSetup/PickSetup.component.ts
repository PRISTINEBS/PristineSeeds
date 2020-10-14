import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {FormControl} from "@angular/forms";
import {SetupAllPickModel} from "../../../modal/SetupModel";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";


@Component({
    selector: 'TrayMaster',
    templateUrl: './PickSetup.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./PickSetup.component.scss']
})
export class PickSetupComponent implements OnInit, OnDestroy {
    minPickToPick: FormControl = new FormControl();
    UpdatePick: FormControl = new FormControl();
    status: boolean = false;
    MinPickDetail: Array<SetupAllPickModel> = [];
    UpdatePickDetail: Array<SetupAllPickModel> = [];

    constructor(private validateResponse: ValidateResponse,
                private sessionManageMent: SessionManageMent,
                public composeDialog: MatDialog,
                private encryptdecrypt: EncriptDecript,
                private pristineToaster: ToastrService,
                private webApiHttp: WebApiHttp) {
    }

    ngOnInit() {
        this.status = false;
        const postedJson = {
            flag: "select"
        };
        try {
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickSetupAll, postedJson)
                .then(result => {
                    console.log(result);
                    this.MinPickDetail = result as SetupAllPickModel[];
                    this.minPickToPick.setValue(this.MinPickDetail[0].min_bin);
                    this.minPickToPick.disable
                })
        } catch (e) {

        }
    }

    Submit() {
        let value: number;
        value = parseInt(this.UpdatePick.value);
        if (value <= 10) {
            this.pristineToaster.error('error', 'Entered Bin number can not less then 10')
        } else {
            const PostedJson = {
                flag: "update",
                NoOfBin: value
            };
            try {
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickSetupAll, PostedJson)
                    .then(result => {
                        this.UpdatePickDetail = result as SetupAllPickModel[];
                        if (this.UpdatePickDetail[0].condition.toLowerCase() == 'true') {
                            this.pristineToaster.success('success', 'Bin Successfully Updated');
                            this.ngOnInit()
                        } else {
                            this.pristineToaster.error('error', this.UpdatePickDetail[0].message)
                        }

                    }, error => {
                        console.log(error)
                    })
            } catch (e) {
                console.log(e);
            }
        }
    }

    UpdateBin() {
        this.status = true
    }

    Cancle() {
        this.status = false
    }

    ngOnDestroy(): void {

    }
}


