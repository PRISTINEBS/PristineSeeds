import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WebApiHttp} from "../../../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'app-createdsp',
    templateUrl: './createdspserviceability.component.html',
    styleUrls: ['./createdspserviceability.component.scss']
})
export class CreatedspserviceabilityComponent implements OnInit {

    newdsp: FormGroup
    dspList: any;
    priortiylist: Map<number, string> = new Map<number, string>();


    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<CreatedspserviceabilityComponent>,
                public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
    ) {
        this.newdsp = new FormBuilder().group({
            LocationId: [this.sessionManageMent.getLocationId],
            DSPCode: ['', Validators.required],
            Pincode: ['', Validators.required],
            Express: ['', Validators.required],
            ReversePickUp: ['', Validators.required],
            Priority: ['', Validators.required],
            Cost: ['', Validators.required],
            Flag: []
        })
        if (data != null) {
            this.newdsp.get('DSPCode').setValue(data.dsp_code);
            this.newdsp.get('Pincode').setValue(data.pincode);
            this.newdsp.get('Express').setValue(data.express);
            this.newdsp.get('ReversePickUp').setValue(data.reversepickup);
            this.newdsp.get('Priority').setValue(data.priority);
            this.newdsp.get('Cost').setValue(data.cost);
            this.newdsp.get('DSPCode').disable();
            this.newdsp.get('Pincode').disable();
            this.newdsp.get('Flag').setValue('update');
        } else {
            this.newdsp.get('Flag').setValue('insert');
        }
    }

    ngOnInit(): void {
        this.priortiylist.set(1, 'High');
        this.priortiylist.set(2, 'Default');
        this.priortiylist.set(3, 'Low');
        this.dsplist();
    }

    dsplist() {
        try {
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.DSPPartnerList + this.sessionManageMent.getLocationId).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dspList = result
                    }
                }
            )
        } catch (e) {

        }
    }

    send() {
        this.dialogRef.close();
    }


    CreateDSP() {

        this.newdsp.get('DSPCode').enable();
        this.newdsp.get('Pincode').enable();
        this.dialogRef.close(this.newdsp.value);
    }
}
