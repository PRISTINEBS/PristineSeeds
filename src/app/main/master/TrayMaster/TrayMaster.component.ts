import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {TrayMasterService} from "./TrayMaster.service";
import {MatSort} from "@angular/material/sort";
import {ToastrService} from "ngx-toastr";
import {TrayMasterModel} from "../../../modal/TrayMasterModel";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {PristineConfirmDialogInputComponent} from "../../../../@pristine/components/confirm-dialog-input/confirm-dialog-input.component";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {PromiseResponse} from "../../../modal/PromiseResponse";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";


@Component({
    selector: 'TrayMaster',
    templateUrl: './TrayMaster.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./TrayMaster.component.scss']
})
export class TrayMasterComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['tray_id', 'tray_state', 'pick_no', 'quantity', 'picker_id', 'direction', 'Action'];
    dataSource: MatTableDataSource<TrayMasterModel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private validateResponse: ValidateResponse,
                private sessionManageMent: SessionManageMent,
                public trayMasterService: TrayMasterService,
                public composeDialog: MatDialog,
                public excelService: ExcelService,
                private pristineToaster: ToastrService,
                private webApiHttp: WebApiHttp) {
    }

    applyFilter(filterValue: string, keyName: string) {
        this.dataSource.filter = filterValue;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
            if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
                return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
            } else {
                return false
            }

        };
    }

    ngOnInit() {
        this.trayMasterService.AllTrayList.subscribe(result => {
            if (result == null) {
                this.dataSource = new MatTableDataSource<TrayMasterModel>(result);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                return;
            }
            if (this.validateResponse.checkArray(result)) {
                if (this.validateResponse.checkArrayResponseCondition(result) == true) {
                    this.dataSource = new MatTableDataSource<TrayMasterModel>(result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                } else {
                    this.pristineToaster.error(result[0].message, 'Error');
                }
            } else {
                this.pristineToaster.error(result.message, 'Error');
            }
        });
    }

    deleteTray(data: TrayMasterModel) {
        const dialogRef = this.composeDialog.open(pristineConfirmDialogComponent);
        dialogRef.componentInstance.confirmMessage = 'Do you want to delete Tray?';
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.trayMasterService.updatePickLine(this.webApiHttp.ApiURLArray.DeleteTray, {
                    TrayID: data.tray_id,
                    LocationId: this.sessionManageMent.getLocationId
                }).then(result => {
                    if (this.validateResponse.checkArray<TrayMasterModel>(result) == true) {
                        if (this.validateResponse.checkArrayResponseCondition<TrayMasterModel>(result) == true) {
                            this.trayMasterService.AllTrayList.next(result);
                            this.pristineToaster.success("Record Updated", "Success")
                        } else {
                            if (result[0].message == 'No Tray Listed') {
                                this.trayMasterService.AllTrayList.next(null);
                            }
                            this.pristineToaster.error(result[0].message, 'Error')
                        }
                    } else {
                        this.pristineToaster.error(result.message, 'Error')
                    }
                })
            }
        });
    }

    AddTray() {
        const dialogRef = this.composeDialog.open(PristineConfirmDialogInputComponent);
        dialogRef.componentInstance.confirmMessage = 'Add Tray';
        dialogRef.componentInstance.inputFieldMessage = 'Please Enter Tray.';
        dialogRef.afterClosed().subscribe((result: PromiseResponse) => {
            if (result.condition == 'true') {
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.NewTray, {
                    TrayID: result.message,
                    Email: this.sessionManageMent.getEmail,
                    LocationId: this.sessionManageMent.getLocationId
                }).then(result => {
                    this.trayMasterService.AllTrayList.next(result);
                });
            }
        });
    }

    downloadExcel() {
        this.excelService.exportAsExcelFile(this.dataSource.data, 'traydata')
    }

    ngOnDestroy(): void {

    }
}


