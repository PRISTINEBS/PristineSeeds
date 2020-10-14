import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {DatePipe} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Documentlist} from "../../grnmodal";

@Component({
    selector: 'app-newgrndialog',
    templateUrl: './newgrndialog.component.html',
    styleUrls: ['./newgrndialog.component.scss']
})
export class NewgrndialogComponent implements OnInit {

    newgrn: FormGroup;
    gateentry: number;
    gateentrylist: Documentlist[];
    searchBygateentry: string;
    documenttype: string;
    vendor_country: string;

    constructor(private dialogRef: MatDialogRef<NewgrndialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data,
                private _formBuilder: FormBuilder,
                public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _toster: ToastrService,
                private datePipe: DatePipe
    ) {

        this.newgrn = _formBuilder.group(
            {
                InvoiceNo: ['', Validators.required],
                InvoiceDate: ['', Validators.required],
                GateEntry: [''],
                BilofEntryAmount: [0],
                BilofEntryNo: [''],
                BilofEntryDate: [''],
                grnway: ['', Validators.required]
            });

        this.gateentry = parseInt(this.sessionManageMent.getGateEntryRequired);

        if (this.gateentry == 1) {
            this.newgrn.get('GateEntry').setValidators([Validators.required]);
            this.get_gateentry();
        }


    }

    ngOnInit(): void {
        if (this.vendor_country.toLowerCase() != 'india' && this.vendor_country.toLowerCase() != 'in') {
            this.newgrn.get('BilofEntryAmount').setValidators([Validators.required]);
            this.newgrn.get('BilofEntryNo').setValidators([Validators.required]);
            this.newgrn.get('BilofEntryDate').setValidators([Validators.required]);
        }
    }

    send() {
        this.dialogRef.close();
    }

    CreateGRN() {
        var json = {
            ExternalInvoiceNo: this.newgrn.get('InvoiceNo').value,
            ExternalInvoiceDate: this.datePipe.transform(this.newgrn.get('InvoiceDate').value.toLocaleString(), 'MM-dd-yyyy'),
            BilofEntryAmount: this.newgrn.get('BilofEntryAmount').value,
            BilofEntryNo: this.newgrn.get('BilofEntryNo').value,
            BilofEntryDate: this.datePipe.transform(this.newgrn.get('BilofEntryDate').value.toLocaleString(), 'MM-dd-yyyy'),
            CreatedBy: this.sessionManageMent.getEmail,
            GateEntryNo: this.newgrn.get('GateEntry').value,
            DocumentType: this.documenttype,
            DocumentNo: this.data,
            grnway: this.newgrn.get('grnway').value
        }
        this.dialogRef.close(json);
    }

    get_gateentry() {
        const json = {DocumentNo: this.data}

        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GateEntryInfoByDocumentNo, json).then(
            result => {
                if (result[0].condition == 'True') {
                    this.gateentrylist = result as Documentlist[]
                } else {
                    this._toster.error(result[0].message, 'Error');
                }
            }
        ).catch(error => {
            this._toster.error(error, 'Error');
        })
    }

}
