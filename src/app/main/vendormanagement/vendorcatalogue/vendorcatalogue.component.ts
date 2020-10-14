import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {VendorcatalogueService} from "./vendorcatalogue.service";
import {Vendorcataloguemodel} from "./vendorcataloguemodel";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {MatDialog} from "@angular/material/dialog";
import {vendorcataloguecreateComponent} from "./vendorcataloguecreate/vendorcataloguecreate.component";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'app-createvendor',
    templateUrl: './vendorcatalogue.component.html',
    styleUrls: ['./vendorcatalogue.component.scss']
})
export class VendorcatalogueComponent implements OnInit {
    CatalogueList: Array<Vendorcataloguemodel> = [];
    displayedColumns: string[] = ['vendor_name', 'item_code', 'description', 'vendor_item_code', 'cost_per_unit', 'Edit', 'Delete'];
    dataSource: MatTableDataSource<Vendorcataloguemodel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private _vendorcatalogueservice: VendorcatalogueService,
                private router: Router,
                private WebApiHttp: WebApiHttp,
                private _toasterService: ToastrService,
                private _encryptdecrypt: EncriptDecript,
                private dialogActions: MatDialog,
                public sessionManageMent: SessionManageMent
    ) {
        this.CatalogueList = this._vendorcatalogueservice.CatalogueList
        this.dataSource = new MatTableDataSource<Vendorcataloguemodel>(this.CatalogueList)

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
        var dialogConfig = this.dialogActions.open(vendorcataloguecreateComponent, {
            data: {flag: 'insert'}
        })
        dialogConfig.afterClosed().subscribe(result => {
            if (result == 'true') {
                this._vendorcatalogueservice.VendorCatalogueList().then(result => {
                    this.CatalogueList = result as Vendorcataloguemodel[];
                    this.dataSource = new MatTableDataSource<Vendorcataloguemodel>(this.CatalogueList)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                })
            }
        })
    }

    OnClickEdit(cataLoguedata: any) {
        var dialogConfig = this.dialogActions.open(vendorcataloguecreateComponent, {
            data: {flag: 'update', catalogue: cataLoguedata}
        })
        dialogConfig.afterClosed().subscribe(result => {
            if (result == 'true') {
                this._vendorcatalogueservice.VendorCatalogueList().then(result => {
                    this.CatalogueList = result as Vendorcataloguemodel[];
                    this.dataSource = new MatTableDataSource<Vendorcataloguemodel>(this.CatalogueList)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                })
            }
        })
    }

    OnClickDelete(data: any) {
        var dialogConfig = this.dialogActions.open(pristineConfirmDialogComponent)
        dialogConfig.componentInstance.confirmMessage = 'Are You Sure ! You want to delete vendor' + ' ' + '(' + data.vendor_name + ')' + ' ' + 'catalogue'
        dialogConfig.afterClosed().subscribe(result => {
            if (result == true) {
                try {
                    const json = {
                        vendor_no: data.vendor_no,
                        item_code: data.item_code,
                    }
                    this.WebApiHttp.Post(this.WebApiHttp.ApiURLArray.VendorCatalogueDelete, json).then(result => {
                        if (result[0].condition.toLowerCase() == 'true') {
                            this._toasterService.success('success', result[0].message);
                            this._vendorcatalogueservice.VendorCatalogueList().then(result => {
                                this.CatalogueList = result as Vendorcataloguemodel[];
                                this.dataSource = new MatTableDataSource<Vendorcataloguemodel>(this.CatalogueList)
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                            })
                        } else {
                            this._toasterService.error('error', result[0].message);
                        }
                    }, error => {
                        this._toasterService.error('error', error)
                    })
                } catch (e) {
                    this._toasterService.error('error', e)
                }
            }
        })
    }
}
