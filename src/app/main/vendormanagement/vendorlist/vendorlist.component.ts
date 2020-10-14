import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {VendorlistService} from "./vendorlist.service";
import {Vendorlistmodel} from "./vendorlistmodel";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'app-createvendor',
    templateUrl: './vendorlist.component.html',
    styleUrls: ['./vendorlist.component.scss']
})
export class VendorlistComponent implements OnInit {
    VendorList: Array<Vendorlistmodel> = [];
    displayedColumns: string[] = ['id', 'name', 'address', 'gst_reg_no', 'Action'];
    dataSource: MatTableDataSource<Vendorlistmodel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private _vendorlistservice: VendorlistService,
                private router: Router,
                private _encryptdecrypt: EncriptDecript,
                public sessionManageMent: SessionManageMent) {
        this.VendorList = this._vendorlistservice.VendorList;
        this.dataSource = new MatTableDataSource<Vendorlistmodel>(this.VendorList)

    }

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

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

    OnClickNew() {
        this.router.navigate(['/vendormanagement/createvendor'])
    }

    OnClickView(data: any) {
        this.router.navigate(['/vendormanagement/viewvendor', {response: this._encryptdecrypt.encrypt(JSON.stringify(data))}])
    }
}
