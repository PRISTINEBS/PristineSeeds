import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {Slotinfo_reportService} from "../slotinfo_report.service";
import {SlotReport} from "../../../../modal/SlotReport";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";


@Component({
    selector: 'SlotOrderDataData',
    templateUrl: './SlotOrderDataData.component.html',
    styleUrls: ['./SlotOrderDataData.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SlotOrderDataDataDialogComponent implements OnInit {  // Horizontal Stepper
    loading: boolean = false;
    AllOrderDetailArray: Array<OrderDetailModel> = [];

    constructor(
        public matDialogRef: MatDialogRef<SlotOrderDataDataDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public _data: DialogDataModel,
        public slotinfoReportService: Slotinfo_reportService,
        private webApiHttp: WebApiHttp,
        private validatedata: ValidateResponse,
        public sessionManageMent: SessionManageMent,
    ) {
        this.loading = true;
        this.slotinfoReportService.getAll_Slot(this.webApiHttp.ApiURLArray.slot_Report, {
            flag: _data.flag,
            order_no: _data.selectedSloatData.order_no,
            LocationId: this.sessionManageMent.getLocationId
        }).then((result: Array<OrderDetailModel>) => {
            if (this.validatedata.checkArrayResponseCondition(result)) {
                this.AllOrderDetailArray = result;
            }
            this.loading = false;
        })
    }

    ngOnInit(): void {

    }

}

export interface DialogDataModel {
    flag: string;
    zonedata: SlotReport;
    selectedSloatData: SloatModel;
}

export class SloatModel {
    condition: string;
    slot_id: string;
    sorting_zone: string;
    status: string;
    order_no: string;
}

export class OrderDetailModel {
    condition: string;
    barcode: string;
    pick_status: string;
    consolidation_qty: string;
    qty_ordered: string;
    remaining_qty: string;
}
