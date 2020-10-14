import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Putwaylistmodel} from "./putwaylistmodel";
import {Component, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {PutwaycreateComponent} from "./putwaycreate/putwaycreate.component";

@Component({
    selector: 'app-putwaylist',
    templateUrl: './putwaylist.component.html',
    styleUrls: ['./putwaylist.component.scss']
})
export class PutwaylistComponent implements OnInit {

    displayedColumns: string[] = ['putway_no', 'putway_type', 'status_name', 'grn_no', 'created_by', 'View', 'Update'];
    dataSource: MatTableDataSource<Putwaylistmodel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        public sessionManageMent: SessionManageMent,
        private webApiHttp: WebApiHttp,
        private router: Router,
        private _encriptDecript: EncriptDecript,
        private _toster: ToastrService,
        private spinner: NgxSpinnerService,
        private composedilog: MatDialog,
    ) {

    }

    ngOnInit(): void {
        this.putway_list();
    }


    putway_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.PutwayList + this.sessionManageMent.getLocationId).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<Putwaylistmodel>(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    } else {
                        this._toster.warning(result[0].message, 'Message');
                    }
                    this.spinner.hide();
                    return;
                    //console.log(this.dataSource);
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

    create_putway() {
        const dialog = this.composedilog.open(PutwaycreateComponent, {
            width: "650px",
        });
        dialog.afterClosed().subscribe(
            data => {

                if (data != undefined && data.hasOwnProperty('GRNHeaderNo')) {
                    this.spinner.show();
                    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PutwayHeaderCreate, data).then(
                        result => {
                            if (result[0].condition == 'True') {

                                this.spinner.hide();
                                this.router.navigate(['/inbound/putwaywork', {response: this._encriptDecript.encrypt(JSON.stringify({putway_no: result[0].putway_no}))}]);
                            } else {
                                this._toster.error(result[0].message, 'Error');
                            }
                            this.spinner.hide();
                        }
                    ).catch(error => {
                        this.spinner.hide();
                        this._toster.error(error, 'Error');
                    })
                }
            });

    }

    viewinfo(putway_no: any) {


    }


    update_putway(putway_no: any) {
        this.router.navigate(['/inbound/putwaywork', {
            response: this._encriptDecript.encrypt(JSON.stringify({
                putway_no: putway_no
            }))
        }]);
    }
}
