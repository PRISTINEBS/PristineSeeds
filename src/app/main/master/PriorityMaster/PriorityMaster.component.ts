import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {PriorityMasterService} from "./PriorityMaster.service";
import {MatDialog} from "@angular/material/dialog";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {PriorityModel} from "../../../modal/PriorityModel";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {ToastrService} from "ngx-toastr";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: 'PriorityMaster',
    templateUrl: './PriorityMaster.component.html',
    styleUrls: ['./PriorityMaster.component.scss']
})
export class PriorityMasterComponent implements OnInit {
    displayedColumns: string[] = ['pick_no', 'priorty', 'created_datetime', 'Action'];
    dataSource: MatTableDataSource<PriorityModel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private validateResponse: ValidateResponse,
                private sessionManageMent: SessionManageMent,
                public priorityMasterService: PriorityMasterService,
                public composeDialog: MatDialog,
                private pristineToaster: ToastrService,
                private webApiHttp: WebApiHttp) {
        this.dataSource = new MatTableDataSource<PriorityModel>(priorityMasterService.AllPickPriorityPickList);
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
    }

    UpdateLinePick(data: PriorityModel) {
        const dialogRef = this.composeDialog.open(pristineConfirmDialogComponent);
        dialogRef.componentInstance.confirmMessage = 'Do you want to Update?';
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.priorityMasterService.updatePickLine(this.webApiHttp.ApiURLArray.ChangePickPriority, {
                    PickNo: data.pick_no,
                    PriorityID: data.priorty,
                    EmailID: this.sessionManageMent.getEmail,
                    WorkType: this.sessionManageMent.getWorkType
                }).then(result => {
                    if (this.validateResponse.checkArray<PriorityModel>(result) == true) {
                        if (this.validateResponse.checkArrayResponseCondition<PriorityModel>(result) == true) {
                            this.dataSource = new MatTableDataSource<PriorityModel>(result);
                            this.dataSource.paginator = this.paginator;
                            this.pristineToaster.success("Record Updated", "Success")
                        } else {
                            this.pristineToaster.error(result[0].message, 'Error')
                        }
                    } else {
                        this.pristineToaster.error(result.message, 'Error')
                    }
                })
            }
        });
    }

}


