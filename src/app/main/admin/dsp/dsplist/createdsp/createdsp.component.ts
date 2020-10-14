import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-createdsp',
    templateUrl: './createdsp.component.html',
    styleUrls: ['./createdsp.component.scss']
})
export class CreatedspComponent implements OnInit {

    newdsp: FormGroup
    stateList: Object;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<CreatedspComponent>,
                public httpClient: HttpClient,
                public sessionManageMent: SessionManageMent
    ) {
        this.newdsp = new FormBuilder().group({
            LocationId: [this.sessionManageMent.getLocationId],
            DSPCode: ['', Validators.required],
            Description: ['', Validators.required],
            APIUrl: ['', Validators.required],
            Address: ['', Validators.required],
            GSTNo: ['', Validators.required],
            State: ['', Validators.required],
            Country: ['', Validators.required],
            Flag: []
        })
        if (data != null) {
            this.newdsp.get('DSPCode').setValue(data.dsp_code);
            this.newdsp.get('Description').setValue(data.description);
            this.newdsp.get('APIUrl').setValue(data.api_url);
            this.newdsp.get('Address').setValue(data.address);
            this.newdsp.get('GSTNo').setValue(data.gst_no);
            this.newdsp.get('State').setValue(data.state);
            this.newdsp.get('Country').setValue(data.country);
            this.newdsp.get('DSPCode').disable();
            this.newdsp.get('Flag').setValue('update');
        } else {
            this.newdsp.get('Flag').setValue('insert');
        }
    }

    ngOnInit(): void {
        this.httpClient.get("assets/State.json").subscribe(data => {
            this.stateList = data;
        })
    }

    send() {
        this.dialogRef.close();
    }

    CreateDSP() {
        this.newdsp.get('DSPCode').enable();
        this.dialogRef.close(this.newdsp.value);
    }
}
