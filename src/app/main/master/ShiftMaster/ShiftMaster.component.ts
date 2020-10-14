import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {NgxSpinnerService} from "ngx-spinner";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {InsertShiftMasterComponent} from "./Insert_UpdateShiftMaster/InsertShiftMaster.component";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {Component, OnInit} from "@angular/core";
import {ShiftModel} from "../../../modal/ShiftModel";
import {MatDialog} from "@angular/material/dialog";
import {ShiftMasterService} from "./ShiftMaster.service";

@Component({
    selector: 'ShiftMaster',
    templateUrl: './ShiftMaster.component.html',
    styleUrls: ['./ShiftMaster.component.scss']
})
export class ShiftMasterComponent implements OnInit {
    AllShift: Array<ShiftModel>;

    constructor(public _shiftMasterService: ShiftMasterService,
                private _sessionManageMent: SessionManageMent,
                private _validateResponse: ValidateResponse,
                public composeDialog: MatDialog,
                private pristineToaster: ToastrService,
                private webApiHttp: WebApiHttp,
                public router: Router,
                private spinner: NgxSpinnerService
    ) {
        this.AllShift = this._shiftMasterService.AllShift;
    }


    ngOnInit(): void {

    }

    openAdd_UpdateDialog(flag: string, shiftUpdateData: ShiftModel) {
        const dialogRef = this.composeDialog.open(InsertShiftMasterComponent, {
            data: {flag: flag, updateData: shiftUpdateData, allSupervisor: this._shiftMasterService.allSupervisor}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result != undefined && result != '') {
                this.AllShift = result;
            }
        });
    }

    RemoveShiftData(id: string) {
        try {
            const dialogRef = this.composeDialog.open(pristineConfirmDialogComponent);
            dialogRef.componentInstance.confirmMessage = 'Do you want to delete?';
            dialogRef.afterClosed().subscribe(result => {
                if (result == true) {
                    this.spinner.show();
                    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.deleteShift, {id: id}).then(result => {
                        if (this._validateResponse.checkArray(result)) {
                            if (this._validateResponse.checkArrayResponseCondition(result)) {
                                this.pristineToaster.success('Shift delete Successful.', 'Error');
                                this.spinner.hide();
                                this._shiftMasterService.getallShift().then(allshift => {
                                    if (this._validateResponse.checkArray(allshift)) {
                                        if (this._validateResponse.checkArrayResponseCondition<ShiftModel>(allshift) == true) {
                                            this.AllShift = allshift;
                                        } else {
                                            this.AllShift = [];
                                        }
                                    } else {
                                        this.AllShift = [];
                                    }
                                });
                            } else
                                this.pristineToaster.error(result[0].message, 'Error');
                        } else
                            this.pristineToaster.error(result.message, 'Error')
                    })
                }
            });
        } catch (e) {
            this.pristineToaster.error(e, 'Error')
        } finally {
            this.spinner.hide();
        }
    }
}
