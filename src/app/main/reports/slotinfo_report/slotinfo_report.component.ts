import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AllSlotDataDialogComponent} from "./AllSlotData/AllSlotData.component";
import {pristineAnimations} from "../../../../@pristine/animations";
import {SlotReport} from "../../../modal/SlotReport";
import {Slotinfo_reportService} from "./slotinfo_report.service";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";

@Component({
    selector: 'slotinfo_report',
    templateUrl: './slotinfo_report.component.html',
    styleUrls: ['./slotinfo_report.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: pristineAnimations
})
export class Slotinfo_reportComponent implements OnInit {
    slot_listData: Array<SlotReport> = [];

    constructor(private webApiHttp: WebApiHttp,
                public slotinfoReportService: Slotinfo_reportService,
                public _matDialog: MatDialog,
                public _slotinforeportservice: Slotinfo_reportService) {
    }

    ngOnInit(): void {
        this.slotinfoReportService.zonelistTable.subscribe(result => {
            this.slot_listData = result;
        })


    }

    openSlot(slot_type: string, zonedata: SlotReport) {
        var dialogRef = this._matDialog.open(AllSlotDataDialogComponent, {
            panelClass: 'mail-compose-dialog',
            disableClose: true,
            data: {
                flag: slot_type,
                zonedata: zonedata
            }
        });
        dialogRef.afterClosed()
            .subscribe(response => {
                this.ngOnInit();
            });
        dialogRef.keydownEvents().subscribe(event => {
            if (event.keyCode == 27)
                dialogRef.close();
        });
    }

    DownLoadReport() {
        this.slotinfoReportService.GetSlotInfoData().then(result => {
            this._slotinforeportservice.ExportToExcel(result, 'SlotInfoReport')
        })

    }
}


