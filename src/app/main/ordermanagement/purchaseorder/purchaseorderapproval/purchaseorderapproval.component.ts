import {NgxSpinnerService} from "ngx-spinner";
import {PurchaseorderapprovalList} from "./purchaseorderapprovalmodel";
import {ToastrService} from "ngx-toastr";
import {Component, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {ApprovaldialogComponent} from "./approvaldialog/approvaldialog.component";

@Component({
    selector: 'app-purchaseorderapproval',
    templateUrl: './purchaseorderapproval.component.html',
    styleUrls: ['./purchaseorderapproval.component.scss']
})
export class PurchaseorderapprovalComponent implements OnInit {

    dataSource: MatTableDataSource<PurchaseorderapprovalList>;
    displayedColumns: string[] = ['document_no', 'vendor_no', 'order_date', 'pay_terms', 'created_by', 'gst_total', 'total_amount', 'net_amount', 'View', 'Action'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private router: Router,
                private _encriptDecript: EncriptDecript,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService,
                private composedilog: MatDialog) {
    }

    ngOnInit(): void {
        this.po_approval_list();
    }

    po_approval_list() {
        try {
            this.spinner.show()
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.POForApporoval + this.sessionManageMent.getLocationId).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<PurchaseorderapprovalList>(result);
                        this.dataSource.paginator = this.paginator
                        this.dataSource.sort = this.sort;
                    } else {
                        this.dataSource = new MatTableDataSource<PurchaseorderapprovalList>([]);
                        this._toster.error(result[0].message, 'Error');
                    }
                    this.spinner.hide();
                }
            ).catch(e => {
                this._toster.error(e, 'Error');
                this.spinner.hide();
            })
        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
        }
    }


    openforapproval(element: any) {
        try {

            const dialog = this.composedilog.open(ApprovaldialogComponent, {
                width: "750px",
                data: element.document_no
            });

            dialog.afterClosed().subscribe(
                data => {

                    if (data != undefined && data.hasOwnProperty('Orderstatus')) {
                        this.spinner.show();
                        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.POApporoved, data).then(
                            result => {
                                if (result[0].condition == 'True') {
                                    this._toster.success(result[0].message, 'Success');
                                    this.po_approval_list();
                                } else {
                                    this._toster.error(result[0].message, 'Error');
                                }
                                this.spinner.hide();
                            }
                        ).catch(e => {
                            this._toster.error(e, 'Error');
                            this.spinner.hide();
                        })
                    }
                })

        } catch (e) {
            this._toster.error(e, 'Error');
            this.spinner.hide();
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


    viewinfo(document_no: any) {
        this.router.navigate(['/ordermanagement/purchaseorderview', {response: document_no}]);
    }
}
