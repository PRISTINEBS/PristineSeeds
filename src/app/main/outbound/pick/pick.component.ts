import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Pickmodel} from "./pickmodel";
import {FormControl, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {PreviewFileComponent} from "./previewFile/previewFile.component";
import {interval, Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-pick',
    templateUrl: './pick.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./pick.component.scss']
})


export class PickComponent implements OnInit {

    trayNo: FormControl = new FormControl('', Validators.required);
    scanbarcode: FormControl = new FormControl();
    pickmodel: Pickmodel;
    what_to_show: string;
    picker_zone_info: string;
    scanbin: FormControl = new FormControl();
    current_image: string;
    current_image_count: number = 1;
    change_image_subcription: Subscription;
    rerun_image = interval(2000);
    close_tray: FormControl = new FormControl();
    focus_close_tray: boolean;
    focus_start_tray: boolean;

    constructor(private pristinetoster: ToastrService,
                private webApiHttp: WebApiHttp,
                public sessionmanagent: SessionManageMent,
                private composedilog: MatDialog,
                private spinner: NgxSpinnerService) {
    }

    ngOnInit() {
        this.change_image_subcription = this.rerun_image.subscribe(async val => await this.changeimage());
        this.PickInfo();
    }

    async change_by_action() {
        switch (this.pickmodel.action.toLowerCase()) {
            case 'scan_pick':
                this.scanbin.setValue('');
                this.scanbarcode.setValue('');
                this.what_to_show = this.pickmodel.action.toLowerCase();
                await this.changeimage();
                break;
            case 'scan_tray':
                this.trayNo.setValue('');
                this.what_to_show = this.pickmodel.action.toLowerCase();
                this.picker_zone_info = this.pickmodel.message + ' in Zone : ' + this.pickmodel.pick_zone + ' for Shift : ' + this.pickmodel.shift_name;
                this.focus_start_tray = true;
                this.change_image_subcription.unsubscribe();
                break;
            case 'close_tray':
                this.close_tray.setValue('');
                this.what_to_show = this.pickmodel.action.toLowerCase();
                this.focus_close_tray = true;
                this.change_image_subcription.unsubscribe();
                break;
            case 'no_pick':
                this.what_to_show = this.pickmodel.action.toLowerCase();
                this.change_image_subcription.unsubscribe();
                break;
        }
    }

    async PickInfo() {
        try {
            this.spinner.show();

            await this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pickinfo + this.sessionmanagent.getEmail + '&location_id=' + this.sessionmanagent.getLocationId).then(
                result => this.pickmodel = result[0] as Pickmodel
            ).finally(() => {
                this.spinner.hide();
            });

            if (this.pickmodel.condition.toLowerCase() == "true") {
                await this.change_by_action();
            } else if (this.pickmodel.condition.toLowerCase() == "false") {
                this.pristinetoster.error(this.pickmodel.message.toString(), "Error");
                this.what_to_show = "error";
            }
        } finally {
            this.spinner.hide();
        }
    }

    async trayscan(trayvalue: string) {
        try {
            await this.PickInfo();
            this.spinner.show();
            if (this.pickmodel.action.toLowerCase() == 'scan_tray') {
                const json = {
                    EmailId: this.sessionmanagent.getEmail,
                    PickZone: this.pickmodel.pick_zone,
                    ShiftId: this.pickmodel.shift_id,
                    TrayNo: trayvalue,
                    WorkType: this.sessionmanagent.getWorkType,
                    LocationId: this.sessionmanagent.getLocationId
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.picktrayscan, json).then(
                    result => {
                        this.pickmodel = result[0] as Pickmodel;
                        if (this.pickmodel.condition.toLowerCase() == "true") {
                            this.what_to_show = this.pickmodel.action.toLowerCase();

                        } else if (this.pickmodel.condition.toLowerCase() == "false") {
                            this.pristinetoster.error(this.pickmodel.message.toString(), "Error");
                            this.trayNo.setValue('');
                        }
                    }
                ).catch(error => {
                    this.spinner.hide();
                })
            }

        } finally {
            this.spinner.hide();
        }
    }

    async scanbinvalidation(value: string) {
        if (value != this.pickmodel.bincode) {
            this.pristinetoster.error("Please Scan Bincode " + this.pickmodel.bincode, "Error");
            this.scanbin.setValue('');
            document.getElementById('scanbin').focus();
            return false;
        } else {
            //this.scanbarcode.setValue('');
            document.getElementById('scanbarcode').focus();
            return true;
        }

    }

    async scanbarcodevalidation(value: any) {
        try {
            this.spinner.show();
            if (await this.scanbinvalidation(this.scanbin.value)) {
                const json = {
                    EmailId: this.sessionmanagent.getEmail,
                    PickNo: this.pickmodel.pick_no,
                    PickLineNo: this.pickmodel.pick_line_no,
                    TrayNo: this.pickmodel.tray,
                    Barcode: this.scanbarcode.value
                }

                await this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pickbinbarcodescan, json).then(
                    async result => {
                        if (result[0].condition.toString().toLowerCase() == "true") {
                            this.pickmodel = result[0] as Pickmodel;
                            await this.change_by_action();
                        } else if (result[0].condition.toString().toLowerCase() == "false") {
                            this.pristinetoster.error(result[0].message.toString(), "Error");
                        }

                        this.scanbarcode.setValue('');
                        this.scanbin.setValue('');
                        document.getElementById('scanbin').focus();
                    }
                ).catch(err => {
                    this.spinner.hide();
                })
            }
        } finally {
            this.spinner.hide();
        }
    }

    async closeTray(value: any) {
        try {
            this.spinner.show();
            const json = {
                EmailId: this.sessionmanagent.getEmail,
                PickNo: this.pickmodel.pick_no,
                TrayNo: this.pickmodel.tray,
                LocationId: this.sessionmanagent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pickclosetray, json).then(
                result => {
                    if (result[0].condition.toString().toLowerCase() == "true") {
                        this.pickmodel = result[0] as Pickmodel;
                        console.log(this.pickmodel);
                        this.change_by_action();
                    } else if (result[0].condition.toString().toLowerCase() == "false") {
                        this.pristinetoster.error(result[0].message.toString(), "Error");
                        this.scanbarcode.setValue('');
                        this.scanbin.setValue('');
                        document.getElementById('scanbin').focus();
                    }
                }
            ).catch(err => {
                this.spinner.hide();
            })
        } finally {
            this.spinner.hide();
        }
    }

    async user_close_tray() {
        this.what_to_show = "close_tray";
        this.close_tray.setValue('');
        this.change_image_subcription.unsubscribe();
        this.focus_close_tray = true;
    }

    async not_found() {
        try {
            this.spinner.show();
            if (await this.scanbinvalidation(this.scanbin.value)) {
                const json = {
                    PickNo: this.pickmodel.pick_no,
                    PickLineNo: this.pickmodel.pick_line_no,
                    EmailId: this.sessionmanagent.getEmail,
                    UserZone: this.pickmodel.pick_zone
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.picknotfound, json).then(
                    result => {
                        if (result[0].condition.toString().toLowerCase() == "true") {
                            this.pickmodel = result[0] as Pickmodel;
                            console.log(this.pickmodel);
                            this.change_by_action();
                        } else if (result[0].condition.toString().toLowerCase() == "false") {
                            this.pristinetoster.error(result[0].message.toString(), "Error");
                            this.scanbarcode.setValue('');
                            this.scanbin.setValue('');
                            document.getElementById('scanbin').focus();
                        }
                    }
                ).catch(err => {
                    this.spinner.hide();
                })
            }
        } finally {
            this.spinner.hide();
        }
    }

    async wrong_image() {
        try {
            this.spinner.show();
            if (await this.scanbinvalidation(this.scanbin.value)) {
                const json = {
                    PickNo: this.pickmodel.pick_no,
                    PickLineNo: this.pickmodel.pick_line_no,
                    EmailId: this.sessionmanagent.getEmail,
                    UserZone: this.pickmodel.pick_zone
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pickbinbarcodescan, json).then(
                    result => {
                        if (result[0].condition.toString().toLowerCase() == "true") {
                            this.pickmodel = result[0] as Pickmodel;
                            this.change_by_action();
                        } else if (result[0].condition.toString().toLowerCase() == "false") {
                            this.pristinetoster.error(result[0].message.toString(), "Error");
                            this.scanbarcode.setValue('');
                            this.scanbin.setValue('');
                            document.getElementById('scanbin').focus();
                        }
                    }
                ).catch(err => {
                    this.spinner.hide();
                })
            }
        } finally {
            this.spinner.hide();
        }
    }

    async Setimage() {
        this.current_image_count = 1;
        this.current_image = this.pickmodel.images.img1;
    }

    async changeimage() {
        try {
            if (this.pickmodel != undefined && this.pickmodel.images != undefined) {
                this.current_image = this.pickmodel.images.img1;
                switch (this.current_image_count) {
                    case 1:
                        this.current_image_count = 2;
                        this.current_image = this.pickmodel.images.img2
                        break;
                    case 2:
                        this.current_image_count = 3;
                        this.current_image = this.pickmodel.images.img3
                        break;
                    case 3:
                        this.current_image_count = 4;
                        this.current_image = this.pickmodel.images.img4
                        break;
                    case 4:
                        this.current_image_count = 1;
                        this.current_image = this.pickmodel.images.img1
                        break;
                }
            }
        } catch (e) {
            console.log(e);
        }

    }

    async open_image_preview() {
        const dialog = this.composedilog.open(PreviewFileComponent, {
            width: "950px",
            data: this.pickmodel.images
        });
        dialog.componentInstance.current_image = this.current_image;
        dialog.componentInstance.headerInfo = this.pickmodel.description + "( " + this.pickmodel.barcode + " )";
    }

    ngOnDestroy() {
        this.change_image_subcription.unsubscribe();
    }
}
