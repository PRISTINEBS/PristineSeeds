import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {NgxSpinnerService} from "ngx-spinner";
import {Viewbinmodel} from "./viewbinmodel";
import {BarcodelistComponent} from "../../barcodelist/barcodelist.component";

@Component({
    selector: 'app-viewbin',
    templateUrl: './viewbin.component.html',
    styleUrls: ['./viewbin.component.scss']
})
export class ViewbinComponent implements OnInit {

    displayedColumns: string[] = ['item_no', 'name', 'main_category', 'expiry_date', 'vendor_lot_no', 'quantity', 'Barcode'];
    dataSource: MatTableDataSource<Viewbinmodel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    inputjson: any

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private _toster: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private composedilog: MatDialog,
                private _encriptDecript: EncriptDecript,
                private spinner: NgxSpinnerService) {

        this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')))


    }

    ngOnInit(): void {

        this.getdocument_full_info();

    }


    getdocument_full_info() {
        try {
            this.spinner.show();
            var json = {
                LocationId: this.sessionManageMent.getLocationId,
                Bincode: this.inputjson.bincode
            }
            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.BinInfo, json).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<Viewbinmodel>(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        console.log(this.dataSource);
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
        data = {item_no: data.item_no, bincode: this.inputjson.bincode}
        this.composedilog.open(BarcodelistComponent, {width: "800px", data});

    }
}
