import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {ForceAssignMentMasterService} from "./ForceAssignMentMaster.service";
import {MatSort} from "@angular/material/sort";
import {isArray} from "rxjs/internal-compatibility";
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {ForceAssignmentModel} from "../../../modal/ForceAssignmentModel";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'ForceAssignMentMaster',
    templateUrl: './ForceAssignMentMaster.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./ForceAssignMentMaster.component.scss']
})
export class ForceAssignMentMasterComponent implements OnInit {
    displayedColumns: string[] = ['pick_no', 'pick_zone', 'total_bin', 'total_qty_needed_to_pick', 'distribution', 'Picker'];
    dataSource: MatTableDataSource<ForceAssignmentModel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('pickNo', {static: true}) pickNo: ElementRef;
    loading: boolean = false;
    submithit: boolean = false;

    constructor(private validateResponse: ValidateResponse,
                private sessionManageMent: SessionManageMent,
                public forceAssignMentMasterService: ForceAssignMentMasterService,
                public composeDialog: MatDialog,
                private _webapiHttp: WebApiHttp,
                private pristineToaster: ToastrService) {
        this.dataSource = new MatTableDataSource<ForceAssignmentModel>(this.forceAssignMentMasterService.AllforceAssignmentList);
    }


    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getPickInfoFromServer(pick_no: string) {
        this.loading = true;
        this.forceAssignMentMasterService.getPickInfoFromServer(pick_no).then(() => {
            this.dataSource = new MatTableDataSource<any>(this.forceAssignMentMasterService.AllforceAssignmentList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loading = false;
        }, error => this.loading = false).catch(err => {
            this.loading = false;
            this.pristineToaster.error(err.message, "Error");
        })
    }

    SubmitForceAssignMent() {
        if (!this.submithit) {
            let ZoneWithPicker: Array<{ Zone: string, Picker: string }> = [];
            try {
                for (var i = 0; i < this.dataSource.data.length; i++) {
                    if (this.dataSource.data[i].selectedPicker == null || this.dataSource.data[i].selectedPicker == undefined || this.dataSource.data[i].selectedPicker.length <= 0) {
                        this.pristineToaster.error('Please Select at least One picker in all Zone.', 'Error');
                        return;
                    }
                    for (var j = 0; j < this.dataSource.data[i].selectedPicker.length; j++) {
                        ZoneWithPicker.push({
                            Zone: this.dataSource.data[i].pick_zone,
                            Picker: this.dataSource.data[i].selectedPicker[j]
                        });
                    }
                }
            } catch (e) {
            }
            let postedJason = {
                PickNo: this.dataSource.data[0].pick_no,
                ZoneWithPicker: ZoneWithPicker
            };
            this._webapiHttp.Post(this._webapiHttp.ApiURLArray.ForceAssigment_submit, postedJason).then(result => {
                if (isArray(result)) {
                    if (this.validateResponse.checkArrayResponseCondition(result)) {
                        this.pickNo.nativeElement.value = '';
                        this.dataSource = new MatTableDataSource<any>([]);
                        this.pristineToaster.success(result[0].message, 'Success');
                    } else {
                        this.pristineToaster.error(result[0].message, 'Error');
                    }
                } else {
                    this.pristineToaster.error(result.message, 'Error');
                }
                this.submithit = false;
            }, error => this.submithit = false).catch(err => {
                this.pristineToaster.error('Api Response Error ' + err.message, 'Error');
                this.submithit = false;
            });
        }
    }
}


