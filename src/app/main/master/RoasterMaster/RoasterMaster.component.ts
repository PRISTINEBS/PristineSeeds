import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {AllPickerModel, PickZoneModel, RosterSubmitHitModel} from "../../../modal/ShiftModel";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";
import {RoasterMasterService} from "./RoasterMaster.service";

@Component({
    selector: 'RoasterMaster',
    templateUrl: './RoasterMaster.component.html',
    styleUrls: ['./RoasterMaster.component.scss']
})
export class RoasterMasterComponent implements OnInit, OnDestroy {
    allPickZone: Array<PickZoneModel>;
    allPicker: Array<AllPickerModel>;
    step = 0;
    // todo Roaster Work
    submitHitForServer: boolean = false;
    SelectTedPickerinner: FormControl = new FormControl();
    ZonePickCombination: Array<{ id: number, zone: string, add_cust: boolean, picker: Array<{ picker_id: string, active: number }> }> = [];
    ZoneType: FormControl = new FormControl();
    SelectTedPicker: FormControl = new FormControl();
    isDefault: FormControl = new FormControl();
    curent_Id = 0;

    constructor(public _roasterMasterService: RoasterMasterService,
                public _sessionManageMent: SessionManageMent,
                private _validateResponse: ValidateResponse,
                private pristineToaster: ToastrService,
                private spinner: NgxSpinnerService,
                private webApiHttp: WebApiHttp) {
    }

    ngOnInit() {
        this._roasterMasterService.allPickZone.subscribe((result: Array<PickZoneModel>) => {
            this.allPickZone = result;
            this.validateZone_Picker('zone');
        });
        this._roasterMasterService.allPicker.subscribe(result => {
            this.allPicker = result;
            this.validateZone_Picker('picker');
        });
        if (this._roasterMasterService.getDefaultRoaster.length > 0 && this._roasterMasterService.getDefaultRoaster[0].shift_name != null
            && this._roasterMasterService.getDefaultRoaster[0].shift_name != undefined && this._roasterMasterService.getDefaultRoaster[0].shift_name != '') {
            this.bindRoasterForUi(this._roasterMasterService.getDefaultRoaster);
        }
    }

    ngOnDestroy(): void {

    }

    setStep(index: number) {
        this.step = index;
    }

    submitRoasterdata() {
        // if (this.allPickZone.length == 0) {
        if (!this.submitHitForServer) {
            this.submitHitForServer = true;
            //todo bind header
            let header: Array<{
                PickingZone: string;
                NoOfWorker: number;
                Shift: string;
                WorkType: string
                IsDefault: number;
                CreatedBy: string;
                LocationId: any
            }> = [];
            for (let i = 0; i < this.ZonePickCombination.length; i++) {
                header.push({
                    PickingZone: this.ZonePickCombination[i].zone,
                    NoOfWorker: this.ZonePickCombination[i].picker.length,
                    Shift: this._roasterMasterService.getDefaultRoaster[0].shift_id,
                    WorkType: this._sessionManageMent.getWorkType,
                    IsDefault: (this.isDefault.value == null || this.isDefault.value == undefined || this.isDefault.value == false) ? 0 : 1,
                    CreatedBy: this._sessionManageMent.getEmail,
                    LocationId: this._sessionManageMent.getLocationId
                });
            }
            //todo end header;
            //todo bind line
            let line: Array<{ PickingZone: string, Pick: string }> = [];
            for (let i = 0; i < this.ZonePickCombination.length; i++) {
                for (let j = 0; j < this.ZonePickCombination[i].picker.length; j++) {
                    line.push({
                        PickingZone: this.ZonePickCombination[i].zone,
                        Pick: this.ZonePickCombination[i].picker[j].picker_id
                    });
                }
            }
            //todo end line;
            //todo bind movement user who move one zone to another zone;
            let movement: Array<{ picker_email: string, zone: string }> = [];
            for (let i = 0; i < this._roasterMasterService.by_usermovement.length; i++) {
                for (let j = 0; j < this._roasterMasterService.movementList.length; j++) {
                    if (this._roasterMasterService.by_usermovement[i].picker_email == this._roasterMasterService.movementList[j].picker_email) {
                        if (this._roasterMasterService.by_usermovement[i].zone != this._roasterMasterService.movementList[j].zone)
                            movement.push(this._roasterMasterService.by_usermovement[i]);
                    }
                }
            }
            //todo end
            var postedjson = {
                Header: header,
                Line: line,
                movement: movement
            };
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.createRoster, postedjson).then(async result => {
                if (this._validateResponse.checkArrayResponseCondition(result) == true) {
                    this._roasterMasterService.by_usermovement = [];
                    this.pristineToaster.success('Roster Successful Inserted.', 'success');
                    this.submitHitForServer = false;
                    await this._roasterMasterService.resetPickZoneOrPicker();
                    this.bindRoasterForUi(result);
                }
            }, errr => {
                this.submitHitForServer = false;
                this.pristineToaster.error('Api Response Error.' + errr.message, 'Error');
            }).catch(err => {
                this.submitHitForServer = false;
                this.pristineToaster.error('Api Response Error.' + err.message, 'Error');
            });
        }
        // }
        // else {
        //     this.pristineToaster.onError('Error', 'Please Select All Zone.');
        // }
    }

    bindRoasterForUi(displaydata: Array<RosterSubmitHitModel>) {
        if (displaydata.length > 0 && displaydata[0].condition.toLowerCase() == "true") {
            this.ZonePickCombination = [];
            this._roasterMasterService.movementList = [];
            for (let i = 0; i < displaydata.length; i++) {
                this.ZonePickCombination.push({
                    id: (i + 1),
                    zone: displaydata[i].zone,
                    add_cust: false,
                    picker: displaydata[i].picker
                });
                var zone = displaydata[i].zone;
                for (let j = 0; j < displaydata[i].picker.length; j++) {
                    this._roasterMasterService.movementList.push({
                        picker_email: displaydata[i].picker[j].picker_id,
                        zone: zone
                    });
                }
            }
            this._roasterMasterService.resetPickZoneOrPicker();
        }
    }

    AddRosterList() {
        if (this.ZoneType.value == '' || this.ZoneType.value == null || this.ZoneType.value == undefined) {
            this.pristineToaster.error('Please Select Zone.', 'Error');
            return;
        }
        if (this.SelectTedPicker.value == '' || this.SelectTedPicker.value == null || this.SelectTedPicker.value == undefined || this.SelectTedPicker.value.length <= 0) {
            this.pristineToaster.error('Please Select Picker.', 'Error');
            return;
        }
        this.curent_Id += 1;
        let picker: Array<{ picker_id: string, active: number }> = [];
        for (let i = 0; i < this.SelectTedPicker.value.length; i++) {
            picker.push({picker_id: this.SelectTedPicker.value[i], active: 0});
        }
        this.ZonePickCombination.push({
            id: this.curent_Id,
            zone: this.ZoneType.value,
            add_cust: false,
            picker: picker
        });
        this.ZoneType.setValue('');
        this.SelectTedPicker.setValue([]);
        this.validateZone_Picker('zone');
        this.validateZone_Picker('picker');
    }

    AddRosterList_inner(zone: string, selectedPicker: Array<string>, index: number, id: any) {
        if (this.SelectTedPicker == null || this.SelectTedPicker == undefined || selectedPicker.length <= 0) {
            this.pristineToaster.error('Please Select Picker.', 'Error');
            return;
        }
        for (let i = 0; i < selectedPicker.length; i++) {
            this.ZonePickCombination[index].picker.push({picker_id: selectedPicker[i], active: 0});
        }
        this.SelectTedPicker.setValue([]);
        this.validateZone_Picker('zone');
        this.validateZone_Picker('picker');
    }

    dropItem(event: CdkDragDrop<any>, group_zone: string) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        // console.log(event.item.data,group_zone);
        this.checkMovementIfMovementThenAddInto(event.item.data.picker_id, group_zone, 'dragdrop');
    }

    checkMovementIfMovementThenAddInto(picker_id: string, group_zone: string, flag) {
        //todo movement user message send
        if (flag == 'dragdrop') {
            let checkExsist: boolean = false;
            for (let i = 0; i < this._roasterMasterService.by_usermovement.length; i++) {
                if (picker_id == this._roasterMasterService.by_usermovement[i].picker_email) {
                    this._roasterMasterService.by_usermovement[i].zone = group_zone;
                    checkExsist = true;
                    break;
                }
            }
            if (checkExsist == false) {
                this._roasterMasterService.by_usermovement.push({
                    picker_email: picker_id,
                    zone: group_zone
                });
            }
            console.log(picker_id, group_zone, this._roasterMasterService.by_usermovement);
        } else if (flag == 'Remove') {
            let checkExsist: boolean = false;
            for (let i = 0; i < this._roasterMasterService.by_usermovement.length; i++) {
                if (picker_id == this._roasterMasterService.by_usermovement[i].picker_email) {
                    this._roasterMasterService.by_usermovement[i].zone = '';
                    checkExsist = true;
                    break;
                }
            }
            if (checkExsist == false) {
                this._roasterMasterService.by_usermovement.push({
                    picker_email: picker_id,
                    zone: ''
                });
            }
        }
    }

    getConnectedList(): any[] {
        return this.ZonePickCombination.map(x => `${x.id}`);
    }

    dropGroup(event: CdkDragDrop<Array<{ id: number, zone: string, picker: Array<{ picker_id: string, active: number }> }>>) {
        moveItemInArray(this.ZonePickCombination, event.previousIndex, event.currentIndex);
    }

    //todo validate Zone
    validateZone_Picker(flag: string) {
        for (let i = 0; i < this.ZonePickCombination.length; i++) {
            if (flag == 'zone') {
                for (let j = 0; j < this.allPickZone.length; j++) {
                    if (this.ZonePickCombination[i].zone == this.allPickZone[j].zone_type) {
                        this.allPickZone.splice(j, 1);
                    }
                }
            } else if (flag == 'picker') {
                for (let j = 0; j < this.allPicker.length; j++) {
                    for (let k = 0; k < this.ZonePickCombination[i].picker.length; k++) {
                        if (this.ZonePickCombination[i].picker[k].picker_id == this.allPicker[j].email) {
                            this.allPicker.splice(j, 1);
                        }
                    }
                }
            }
        }
    }

    RemovePickerFromZoneData(parentIndex: number, childindex: number, pickerId: string, zoneName) {
        this.checkMovementIfMovementThenAddInto(pickerId, zoneName, 'Remove');
        this.ZonePickCombination[parentIndex].picker.splice(childindex, 1);
        this._roasterMasterService.resetPickZoneOrPicker();
    }
}


