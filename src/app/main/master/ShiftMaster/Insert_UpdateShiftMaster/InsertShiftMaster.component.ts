import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {ToastrService} from "ngx-toastr";
import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ShiftModel} from "../../../../modal/ShiftModel";
import {pristineAnimations} from "../../../../../@pristine/animations";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {NgxSpinnerService} from "ngx-spinner";
import {MatSelectChange} from "@angular/material/select";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'cdk-InsertShiftMaster',
    templateUrl: './InsertShiftMaster.component.html',
    styleUrls: ['./InsertShiftMaster.component.scss'],
    animations: pristineAnimations
})
export class InsertShiftMasterComponent implements OnInit {
    //todo muliple select

    Supervisor_ListData: Array<{ display: string, value: string }> = [];
    totalSelected_Supervisor = [];
    shiftCreateForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<InsertShiftMasterComponent>,
                private webApiHttp: WebApiHttp,
                private pristineToaster: ToastrService,
                private validateResponse: ValidateResponse,
                private formBuilder: FormBuilder,
                private spinner: NgxSpinnerService,
                private sessionManageMent: SessionManageMent,
                @Inject(MAT_DIALOG_DATA) public data: PassData) {
        for (let i = 0; i < this.data.allSupervisor.length; i++) {
            this.Supervisor_ListData.push({
                display: this.data.allSupervisor[i].name,
                value: this.data.allSupervisor[i].email
            });
        }

        this.shiftCreateForm = this.formBuilder.group({
            shift_name: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', [Validators.required]],
            Supervisor: []
        });

        if (data.flag == 'Update shift') {
            this.shiftCreateForm.get('shift_name').setValue(this.data.updateData.shift_name);
            this.shiftCreateForm.get('shift_name').disable();
            this.shiftCreateForm.get('start_date').setValue(this.data.updateData.start_time);
            this.shiftCreateForm.get('end_date').setValue(this.data.updateData.end_time);
            for (let i = 0; i < this.data.updateData.sl.length; i++) {
                this.totalSelected_Supervisor.push(this.data.updateData.sl[i].shift_superviser);
            }
        }
    }


    ngOnInit() {
        this.shiftCreateForm.get('end_date').valueChanges.subscribe(value => {
            this.ShiftTimeValidation();
        });
    }


    close() {
        this.dialogRef.close();
    }

    ShiftTimeValidation() {
        let startTime = this.shiftCreateForm.get('start_date').value;
        let endTime = this.shiftCreateForm.get('end_date').value;
        let _timestart = moment.utc(startTime, 'HH:mm');
        let _timeend = moment.utc(endTime, 'HH:mm');
        if (_timeend.isBefore(_timestart))
            _timeend.add(1, 'day');
        var timeDiff = moment.duration(_timeend.diff(_timestart));
        // var _timeTotal = moment.utc(+timeDiff).format('H:mm');
        if ((timeDiff.asHours() > 9)) {
            this.pristineToaster.error('ERROR', 'Shift can not be more then 9:00 HR');
            this.shiftCreateForm.get('end_date').setValue('');
        }
    }

    OnsubmitHit() {
        try {
            this.spinner.show();
            var json = {
                name: this.shiftCreateForm.get('shift_name').value,
                startDatetime: this.shiftCreateForm.get('start_date').value.toLocaleString(),
                endDatetime: this.shiftCreateForm.get('end_date').value.toLocaleString(),
                supervisor: this.totalSelected_Supervisor,
                LocationId: this.sessionManageMent.getLocationId
            };
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.createShift, json).then(result => {
                if (this.validateResponse.checkArray(result)) {
                    if (this.validateResponse.checkArrayResponseCondition(result)) {
                        this.pristineToaster.success('Success', 'Shift Creation Successful.');
                        this.dialogRef.close(result);
                    } else
                        this.pristineToaster.error('ERROR', result[0].message);
                } else
                    this.pristineToaster.error('ERROR', result.message)
            });
        } catch (e) {

        } finally {
            this.spinner.hide();
        }
    }

    UpdatesubmitHit() {
        try {
            this.spinner.show();
            var json = {
                id: this.data.updateData.id,
                startDatetime: this.shiftCreateForm.get('start_date').value.toString(),
                endDatetime: this.shiftCreateForm.get('end_date').value.toLocaleString(),
                supervisor: this.totalSelected_Supervisor,
                LocationId: this.sessionManageMent.getLocationId
            };
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.updateShift, json).then(result => {
                if (this.validateResponse.checkArray(result)) {
                    if (this.validateResponse.checkArrayResponseCondition(result)) {
                        this.pristineToaster.success('Success', 'Shift Update Successful.');
                        this.dialogRef.close(result);
                    } else
                        this.pristineToaster.error('ERROR', result[0].message);
                } else
                    this.pristineToaster.error('ERROR', result.message)
            });

        } catch (e) {

        } finally {
            this.spinner.hide();
        }
    }

    supervisor_select($event: MatSelectChange) {

    }
}

interface PassData {
    flag: string;
    allSupervisor: Array<{ email: string, name: string }>;
    updateData: ShiftModel;
}


