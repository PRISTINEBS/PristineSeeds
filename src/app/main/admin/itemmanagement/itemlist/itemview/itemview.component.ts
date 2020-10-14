import {Component, OnInit, ViewChild} from '@angular/core';
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {NgxSpinnerService} from "ngx-spinner";
import {Itemviewmodel} from "./itemviewmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {BarcodelistComponent} from "../../../barcodelist/barcodelist.component";

@Component({
    selector: 'app-itemview',
    templateUrl: './itemview.component.html',
    styleUrls: ['./itemview.component.scss']
})
export class ItemviewComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;


    type: string
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['item_no', 'bincode', 'expiry_date', 'quantity', 'quantity_to_take', 'pick_reservation', 'Barcode'];
    iteminfo: Itemviewmodel[]

    constructor(
        private webApiHttp: WebApiHttp,
        private _toster: ToastrService,
        private  router: Router,
        private _encriptDecript: EncriptDecript,
        public sessionManageMent: SessionManageMent,
        private  route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.type = this.route.snapshot.paramMap.get('res')
        this.item_nfo();
    }

    item_nfo() {
        try {
            this.spinner.show();
            const json = {
                item_no: this.type,
                Location_id: this.sessionManageMent.getLocationId
            }

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemFullInfo, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.iteminfo = result;
                        console.log(this.iteminfo);
                        if (this.iteminfo[0].Bininfo[0].condition == 'True') {
                            this.dataSource = new MatTableDataSource<any>(this.iteminfo[0].Bininfo);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                        }
                    } else {
                        this._toster.error(result[0].message, 'Error');
                    }
                    this.spinner.hide();
                }).catch(err => {
                this.spinner.hide();
            })
        } catch (e) {
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

    viewbarcode(data) {
        this.dialog.open(BarcodelistComponent, {width: "800px", data});
    }

    sum_footer(items: Array<any>, attr: string): number {
        let sum_total: number = 0
        for (let i = 0; i < items.length; i++) {
            sum_total += items[i][attr]
        }
        return parseFloat(sum_total.toFixed(2));
    }
}
