import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {Binlistmodel} from "./binlistmodel";
import {MatDialog} from "@angular/material/dialog";
import {NewbinComponent} from "../newbin/newbin.component";

@Component({
    selector: 'app-binlist',
    templateUrl: './binlist.component.html',
    styleUrls: ['./binlist.component.scss']
})
export class BinlistComponent implements OnInit {

    displayedColumns: string[] = ['bin_type', 'bincode', 'zone_type', 'rack', 'sequence_id', 'quantity', 'View', 'Delete'];
    dataSource: MatTableDataSource<Binlistmodel>;
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
        this.bin_list();
    }

    bin_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.BinList + this.sessionManageMent.getLocationId).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<Binlistmodel>(result);
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


    viewinfo(element: any) {
        this.router.navigate(['/admin/viewbin',
            {response: this._encriptDecript.encrypt(JSON.stringify({bincode: element.bincode}))}]);

    }

    createnewbin() {
        const dialog = this.composedilog.open(NewbinComponent, {
            width: "800px"
        });

        dialog.afterClosed().subscribe(
            data => {

                if (data != undefined && data.hasOwnProperty('condition')) {
                    if (data.condition == 'True') {
                        this.bin_list();
                    }
                }
            });
    }

    delete(element: any) {
        try {
            this.spinner.show();
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DeleteBin, {"Sequence": element.id}).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.bin_list();
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
}
