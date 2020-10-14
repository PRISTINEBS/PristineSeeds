import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {SlotOrderDataDataDialogComponent} from "../SlotOrderDataData/SlotOrderDataData.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {Slotinfo_reportService} from "../slotinfo_report.service";
import {SlotReport} from "../../../../modal/SlotReport";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'AllSlotData',
    templateUrl: './AllSlotData.component.html',
    styleUrls: ['./AllSlotData.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AllSlotDataDialogComponent implements OnInit {  // Horizontal Stepper
    loading: boolean = false;
    AllSlotArray: Array<SloatModel> = [];

    constructor(
        public matDialogRef: MatDialogRef<AllSlotDataDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public _data: DialogDataModel,
        public slotinfoReportService: Slotinfo_reportService,
        private webApiHttp: WebApiHttp,
        public _matDialog: MatDialog,
        private validatedata: ValidateResponse,
        public sessionManageMent: SessionManageMent
    ) {

    }

    ngOnInit(): void {
        this.loading = true;
        this.slotinfoReportService.getAll_Slot(this.webApiHttp.ApiURLArray.slot_Report, {
            flag: this._data.flag,
            zone: this._data.zonedata.sorting_zone,
            LocationId: this.sessionManageMent.getLocationId
        }).then((result: Array<SloatModel>) => {
            if (this.validatedata.checkArrayResponseCondition(result)) {
                this.AllSlotArray = result;
            }
            this.loading = false;
        }, er => {
            this.loading = false;
        }).then(error => {
            this.loading = false;
        });
    }

    openSlot(slot_type: string, selectedsloat: SloatModel) {
        if (this._data.flag != 'free_slot') {
            var dialogRef = this._matDialog.open(SlotOrderDataDataDialogComponent, {
                panelClass: 'mail-compose-dialog',
                disableClose: true,
                data: {
                    flag: slot_type,
                    zonedata: this._data.zonedata,
                    selectedSloatData: selectedsloat
                }
            });
            dialogRef.afterClosed()
                .subscribe(response => {
                    // this.ngOnInit();
                });
            dialogRef.keydownEvents().subscribe(event => {
                if (event.keyCode == 27)
                    dialogRef.close();
            });
        }
    }

}

export interface DialogDataModel {
    flag: string;
    zonedata: SlotReport;
}

export class SloatModel {
    condition: string;
    slot_id: string;
    sorting_zone: string;
    status: string;
    order_no: string;
}
