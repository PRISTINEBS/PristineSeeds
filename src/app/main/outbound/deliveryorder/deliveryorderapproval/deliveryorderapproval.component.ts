import {NgxSpinnerService} from "ngx-spinner";
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
import {Deliveryorderapprovallistmodel} from "./deliveryorderapprovalmodel";
import {ApprovaldialogComponent} from "./approvaldialog/approvaldialog.component";

@Component({
    selector: 'app-deliveryorderapproval',
    templateUrl: './deliveryorderapproval.component.html',
    styleUrls: ['./deliveryorderapprovalcomponent.scss']
})
export class DeliveryorderapprovalComponent implements OnInit {

    dataSource: MatTableDataSource<Deliveryorderapprovallistmodel>;
  displayedColumns: string[] = ['document_no', 'customer_no','request_delivery_date','promised_delivery_date','order_datetime',
    'order_status','total_no_of_bags','total_quantity','total_amount','Action'];
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
        this.do_approval_list();
    }

    do_approval_list() {
        try {
            this.spinner.show()
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.DeliveryOrderForApprovalList + this.sessionManageMent.getLocationId).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<Deliveryorderapprovallistmodel>(result);
                        this.dataSource.paginator = this.paginator
                        this.dataSource.sort = this.sort;
                    } else {
                        this.dataSource = new MatTableDataSource<Deliveryorderapprovallistmodel>([]);
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
                        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DeliveryOrderApprovalCnfrm, data).then(
                            result => {
                                if (result[0].condition == 'True') {
                                    this._toster.success(result[0].message, 'Success');
                                    this.do_approval_list();
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


    viewinfo(e) {
        this.router.navigate(['/ordermanagement/salesorderview', {response: e}]);
    }

}
