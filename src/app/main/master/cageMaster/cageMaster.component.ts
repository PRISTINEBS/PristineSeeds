import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {TrayMasterModel} from "../../../modal/TrayMasterModel";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {AddCageModel, CageMasterModel, CageZoneList} from "../../../modal/CageMasterModel";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CageMasterService} from "./cageMaster.service";
import {ConfirmCage_addComponent} from "./confirm-cage_add/confirm-cage_add.component";


@Component({
    selector: 'cageMaster',
    templateUrl: './cageMaster.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./cageMaster.component.scss']
})
export class CageMasterComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['cage_id', 'consolidation_zone', 'pick_no', 'marketplace_name', 'cage_status', 'Action'];
    dataSource: MatTableDataSource<CageMasterModel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    cageZoneList: Array<CageZoneList> = [];

    constructor(private validateResponse: ValidateResponse,
                private sessionManageMent: SessionManageMent,
                public trayMasterService: CageMasterService,
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
        this.trayMasterService.cageList.subscribe(result => {
            if (result == null) {
                this.dataSource = new MatTableDataSource<CageMasterModel>(result);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                return;
            }
            if (this.validateResponse.checkArray(result)) {
                if (this.validateResponse.checkArrayResponseCondition(result) == true) {
                    this.dataSource = new MatTableDataSource<CageMasterModel>(result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                } else {
                    this.pristineToaster.error(result[0].message, 'Error');
                }
            } else {
                this.pristineToaster.error(result.message, 'Error');
            }
        });
        this.trayMasterService.cagZoneList.subscribe(result => {
            if (result != null && this.validateResponse.checkArray(result)) {
                if (this.validateResponse.checkArrayResponseCondition(result) == true) {
                    this.cageZoneList = result;
                }
            }
        });
    }

    deleteTray(data: TrayMasterModel) {
        const dialogRef = this.composeDialog.open(pristineConfirmDialogComponent);
        dialogRef.componentInstance.confirmMessage = 'Do you want to delete Tray?';
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                /*                this.trayMasterService.updatePickLine(this.webApiHttp.ApiURLArray.DeleteTray, {
                                    TrayID: data.tray_id,
                                }).then(result => {
                                    if (this.validateResponse.checkArray<TrayMasterModel>(result) == true) {
                                        if (this.validateResponse.checkArrayResponseCondition<TrayMasterModel>(result) == true) {
                                            this.trayMasterService.cageList.next(result);
                                            this.pristineToaster.success("Record Updated", "Success")
                                        } else {
                                            if (result[0].message == '"No Tray Listed') {
                                                this.trayMasterService.cageList.next(null);
                                            }
                                            this.pristineToaster.error(result[0].message, 'Error')
                                        }
                                    } else {
                                        this.pristineToaster.error(result.message, 'Error')
                                    }
                                })*/
            }
        });
    }

    AddTray() {
        const dialogRef = this.composeDialog.open(ConfirmCage_addComponent);
        dialogRef.componentInstance.confirmMessage = 'Add Cage';
        dialogRef.componentInstance.inputFieldMessage = 'Please Enter Cage.';
        dialogRef.componentInstance.selectFieldMessage = 'Please Enter Zone';
        dialogRef.componentInstance.dropdowndata = this.cageZoneList;
        dialogRef.afterClosed().subscribe((result: AddCageModel) => {
            if (result.condition) {
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AddCage, {
                    CageId: result.inputfield,
                    ConsolidationZone: result.selectField,
                    LocationId: this.sessionManageMent.getLocationId
                }).then(result => {
                    this.trayMasterService.cageList.next(result);
                });
            }
        });
    }

    downloadExcel() {
        this.excelService.exportAsExcelFile(this.dataSource.data, 'cagedata')
    }

    ngOnDestroy(): void {

    }
}


