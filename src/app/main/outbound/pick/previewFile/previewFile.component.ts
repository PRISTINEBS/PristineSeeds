import {Component, Inject, OnInit} from '@angular/core';
import {PickImageModel} from "../pickmodel";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'cdk-previewFile',
    templateUrl: './previewFile.component.html',
    styleUrls: ['./previewFile.component.scss']
})
export class PreviewFileComponent implements OnInit {
    selectedimageData: PickImageModel;
    current_image: string;
    headerInfo: string;

    constructor(private dialogRef: MatDialogRef<PreviewFileComponent>,
                @Inject(MAT_DIALOG_DATA) public data) {

        this.selectedimageData = data;
    }

    ngOnInit() {

    }


    send() {
        this.dialogRef.close();
    }
}




