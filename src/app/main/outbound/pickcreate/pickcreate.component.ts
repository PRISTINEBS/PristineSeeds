import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";
import {Component, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {SelectionModel} from "@angular/cdk/collections";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-pickcreate',
    templateUrl: './pickcreate.component.html',
    styleUrls: ['./pickcreate.component.scss']
})
export class PickcreateComponent implements OnInit {

    documentType: string[] = ['Sales Order', 'Purchase Return Order', 'Transfer Order', 'Return GatePass'];
    orderType: string[] = ['Company Single Order', 'Company Multi Order', 'Marketplace Single Order', 'Marketplace Multi Order'];
    dropdownState: Array<any>;
    dropdownCity: Array<any>;
    dropdownShippingAgent: Array<any>;
    dropdownBinZone: Array<any>
    pickerlist: Array<any>;

    step: number = 1;

    displayedColumns: string[] = ['select', 'document_no', 'pay_type', 'shipment_agent', 'customer_no', 'order_date'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    manual: boolean = false;

    find_order: FormGroup
    create_pick_group: FormGroup
    searchBydata: string;
    searchByCity: string;
    searchByAgent: string;
    searchByPicker: string;

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _formBuilder: FormBuilder,
                private httpClient: HttpClient,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService,
                private matDialog: MatDialog) {
        this.find_order = _formBuilder.group({
            PickType: ['', Validators.required],
            DocumentType: ['', Validators.required],
            OrderType: [{value: '', disabled: true}],
            OrderNo: [''],
            State: [''],
            City: [''],
            Pincode: [''],
            Priority: [''],
            ShippingAgent: [''],
            BinZone: [''],
            LocationId: [this.sessionManageMent.getLocationId]
        });
        this.create_pick_group = new FormBuilder().group({
            PickType: [],
            Nooforder: [0, [Validators.required, Validators.min(0)]],
            Picker: []
        })

        if (this.sessionManageMent.getPickType != 'with_roster') {
            this.manual = true
            this.create_pick_group.get('Picker').setValidators(Validators.required);
        }
    }

    async ngOnInit() {

        await this.searchState();
        await this.searchDistrict();
        await this.dsp_list();
        await this.bin_list();

    }

    searchState() {
        this.httpClient.get("assets/State.json").subscribe(data => {
            this.dropdownState = data as Array<any>;
        });
    }

    searchDistrict() {
        this.httpClient.get("assets/district.json").subscribe(data => {
            this.dropdownCity = data as Array<any>;
        });
    }

    dsp_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.DSPPartnerList + this.sessionManageMent.getLocationId + '&code=1').then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dropdownShippingAgent = result
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.spinner.hide();
                    return;
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

    bin_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pickZone).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dropdownBinZone = result
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.spinner.hide();
                    return;
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

    user_list() {
        try {
            const worktype = this.find_order.get('DocumentType').value == 'Sales Order' ? 'B2C' : 'B2B';
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetAllUser + '?name=picker&worktype=' + worktype + '&location_id=' + this.sessionManageMent.getLocationId)
                .then(result => {
                    if (result[0].condition == 'True') {
                        this.pickerlist = result;
                    }
                }, error => {
                    console.log(error)
                })
        } catch (e) {
            console.log(e)
        }
    }

    setStep(index: number) {
        this.step = index;
    }

    document_typechange() {
        if (this.find_order.get('DocumentType').value == 'Sales Order') {
            this.find_order.get('OrderType').enable({onlySelf: true})
            this.find_order.get('OrderType').setValidators(Validators.required);
            this.find_order.get('OrderType').updateValueAndValidity();
        } else {
            this.find_order.get('OrderType').disable({onlySelf: true})
            this.find_order.get('OrderType').clearValidators();
            this.find_order.get('OrderType').setValue('');
        }
    }

    find_order_for_pick() {
        try {

            this.spinner.show();

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.FindOrder, this.find_order.value).then(
                result => {
                    if (result[0].condition != 'True') {
                        this._toster.info(result[0].message, 'Info');
                        this.create_pick_group.get('Nooforder').setValue(0);
                        this.dataSource = new MatTableDataSource<any>([]);
                    } else {

                        this.dataSource = new MatTableDataSource<any>(result);
                        this.create_pick_group.get('Nooforder').setValue(this.dataSource.data.length);
                        this.dataSource.sort = this.sort;
                        this.dataSource.paginator = this.paginator;
                        this.user_list();
                    }
                    this.create_pick_group.get('PickType').setValue(this.find_order.get('PickType').value);
                    this.select_no_of_order();
                    this.step = 2;
                    this.spinner.hide();
                }).catch(error => {
                this.spinner.hide();
                this._toster.error(error, 'Exception');
            })

        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Exception');
        }
    }

    select_no_of_order() {
        var no: number = this.create_pick_group.get('Nooforder').value;
        this.selection.clear();

        this.dataSource?.data?.forEach((row) => {
            if (no > 0) {
                this.selection.select(row);
            }
            no--;
        });
        if (this.dataSource?.data?.length < this.create_pick_group.get('Nooforder').value) {
            this.create_pick_group.get('Nooforder').setValue(this.dataSource?.data?.length);
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

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource?.data?.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource?.data?.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {

        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    create_pick() {
        try {
            if (parseInt(this.create_pick_group.get('Nooforder').value) > this.dataSource?.data?.length
                || parseInt(this.create_pick_group.get('Nooforder').value) === 0) {
                this._toster.warning('Pick Order must not greater then available order and not zero', 'warning');
                return
            }

            this.spinner.show();
            var json = {
                DocumentType: this.find_order.get('DocumentType').value,
                OrderType: this.find_order.get('OrderType').value,
                PickType: this.create_pick_group.get('PickType').value,
                IsManual: this.manual,
                document_no: this.selection.selected,
                Picker: this.create_pick_group.get('Picker').value,
                EmailId: this.sessionManageMent.getEmail,
                LocationId: this.sessionManageMent.getLocationId
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PickCreation, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this._toster.success(result[0].message, 'Success');
                        this.find_order.reset();
                        this.create_pick_group.reset();
                        this.selection.clear();
                        this.dataSource = new MatTableDataSource<any>([]);

                        if (this.manual) {
                            var dialog = this.matDialog.open(pristineConfirmDialogComponent)
                            dialog.componentInstance.confirmMessage = 'Do you want to print picklist ?';
                            dialog.afterClosed().subscribe(result => {
                                if (result == true) {

                                }
                            })

                        }
                    } else {
                        this._toster.info(result[0].message, 'Info');
                    }
                    this.spinner.hide();
                }).catch(error => {
                this.spinner.hide();
                this._toster.error(error, 'Exception');
            })

        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Exception');
        }
    }
}
