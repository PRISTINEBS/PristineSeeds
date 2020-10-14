import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Component, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";


@Component({
    selector: 'app-picklist',
    templateUrl: './picklist.component.html',
    styleUrls: ['./picklist.component.scss']
})
export class PicklistComponent implements OnInit {

    displayedColumns: string[] = ['pick_no', 'assign_to', 'source_document_type', 'repick', 'pick_status', 'assign_datetime', 'View'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    PickStart: FormGroup;
    pickerList: Array<any>;

    constructor(
        public sessionManageMent: SessionManageMent,
        private webApiHttp: WebApiHttp,
        private router: Router,
        private _encriptDecript: EncriptDecript,
        private _toster: ToastrService,
        private spinner: NgxSpinnerService,
        private _bulder: FormBuilder
    ) {
        this.PickStart = _bulder.group({
            PickNo: new FormControl('', Validators.required),
            Picker: new FormControl('')
        });
    }

    ngOnInit(): void {
        this.pick_list();

        if (this.sessionManageMent.getPickType == 'manual' || this.sessionManageMent.getRoleId == '0' || this.sessionManageMent.getRoleId == '2') {
            this.PickStart.get('Picker').setValidators(Validators.required);
        } else {
            this.PickStart.get('Picker').setValue(this.sessionManageMent.getEmail);
        }
    }

    pick_list() {
        try {
            this.spinner.show();
            const json = {
                EmailId: this.sessionManageMent.getEmail,
                LocationId: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickListManual, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<any>(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.spinner.hide();
                }
            ).catch(e => {
                this.spinner.hide();
                this._toster.error(e, 'Error');
            })
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Error');
        }
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

    start_pick(type: string, element: any = '') {
        try {
            if (type === 'scan') {
                this.spinner.show();

                if (this.sessionManageMent.getPickType == 'manual' || this.sessionManageMent.getRoleId == '0' || this.sessionManageMent.getRoleId == '2') {

                } else {
                    this.PickStart.get('Picker').setValue(this.sessionManageMent.getEmail);
                }

                const json = {
                    EmailId: this.PickStart.get('Picker').value,
                    PickNo: this.PickStart.get('PickNo').value,
                    LocationId: this.sessionManageMent.getLocationId
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickStartManual, json).then(
                    result => {
                        if (result[0].condition == 'True') {

                            this.router.navigate(['/outbound/pickmanual', {res: this._encriptDecript.encrypt('{"action": "' + type + '","Pick":"' + this.PickStart.get('PickNo').value + '","Picker":"' + this.PickStart.get('Picker').value + '" }')}]);
                        } else {
                            this._toster.warning(result[0].message, 'Message');
                        }
                        this.spinner.hide();
                    }
                ).catch(e => {
                    this.spinner.hide();
                    this._toster.error(e, 'Error');
                })
            } else if (type === 'view') {
                this.router.navigate(['/outbound/pickmanual', {res: this._encriptDecript.encrypt('{"action": "' + type + '","Pick":"' + element.pick_no + '","Picker":"' + element.assign_to + '" }')}]);
            }
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Error');
        }
    }

    find_pickerlist() {
        try {
            if (this.PickStart.get('PickNo').value != '' && (this.sessionManageMent.getPickType == 'manual' || this.sessionManageMent.getRoleId == '0' || this.sessionManageMent.getRoleId == '2')) {
                this.spinner.show();
                const json = {
                    PickNo: this.PickStart.get('PickNo').value,
                    LocationId: this.sessionManageMent.getLocationId
                }
                this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickerList, json).then(
                    result => {
                        if (result[0].condition == 'True') {
                            this.pickerList = result;
                        } else {
                            this._toster.warning(result[0].message, 'Message');
                        }
                        this.spinner.hide();
                    }
                ).catch(e => {
                    this.spinner.hide();
                    this._toster.error(e, 'Error');
                })
            }
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Error');
        }
    }
}
