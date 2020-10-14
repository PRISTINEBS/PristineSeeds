import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {itemattributetypecreationComponent} from "./itemattributetypecreation/itemattributetypecreation.component";
import {pristineConfirmDialogComponent} from "../../../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {itemattributetypemodel} from "./itemattributetypemodel";
import {ItemattributetypeService} from "./itemattributetype.service";


@Component({
    selector: 'app-itemattributetype',
    templateUrl: './itemattributetype.component.html',
    styleUrls: ['./itemattributetype.component.scss']
})
export class itemattributetypeComponent implements OnInit {
    id: number;
    ItemAttributeTypeList: Array<itemattributetypemodel> = []
    displayedColumns: string[] = ['code', 'description', 'attribute_value', 'Edit', 'Delete'];
    dataSource: MatTableDataSource<itemattributetypemodel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        private _formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private _itemAttributeService: ItemattributetypeService,
        public webApiHttp: WebApiHttp,
        public _encryptdecrypt: EncriptDecript,
        private  router: Router,
        private dialogActions: MatDialog,
        private  route: ActivatedRoute,
        private fb: FormBuilder,
        private _toasterService: ToastrService
    ) {
        this.ItemAttributeTypeList = this._itemAttributeService.ItemAttributeTypeList

    }


    ngOnInit(): void {
        this.spinner.show();
        if (Array.isArray(this.ItemAttributeTypeList) && this.ItemAttributeTypeList.length) {
            this.dataSource = new MatTableDataSource<itemattributetypemodel>(this.ItemAttributeTypeList)
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.spinner.hide();
        } else {
            this._toasterService.error('error', 'Data not found')
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

    OnClickNew() {
        var dialogConfig = this.dialogActions.open(itemattributetypecreationComponent, {
            data: {flag: 'insert'}
        })
        dialogConfig.afterClosed().subscribe(result => {
            if (result == 'true') {
                this._itemAttributeService.AttributeTypeList().then(result => {
                    this.ItemAttributeTypeList = result as itemattributetypemodel[];
                    this.dataSource = new MatTableDataSource<itemattributetypemodel>(this.ItemAttributeTypeList)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                })
            }
        })
    }

    OnClickEdit(data: any) {
        var dialogConfig = this.dialogActions.open(itemattributetypecreationComponent, {
            data: {flag: 'update', attributeTypeData: data}
        })
        dialogConfig.afterClosed().subscribe(result => {
            if (result == 'true') {
                this._itemAttributeService.AttributeTypeList().then(result => {
                    this.ItemAttributeTypeList = result as itemattributetypemodel[];
                    this.dataSource = new MatTableDataSource<itemattributetypemodel>(this.ItemAttributeTypeList)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                })
            }
        })
    }

    OnClickDelete(data: any) {

        var dialogConfig = this.dialogActions.open(pristineConfirmDialogComponent)
        dialogConfig.componentInstance.confirmMessage = 'Are You Sure ! You want to delete  item attribute value' + ' ' + '(' + data.code + ')'
        dialogConfig.afterClosed().subscribe(result => {
            if (result == true) {
                try {
                    const json = {
                        attribute_no: data.attribute_no,
                    }
                    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemAttributeDelete, json).then(result => {
                        if (result[0].condition.toLowerCase() == 'true') {
                            this._toasterService.success('success', result[0].message);
                            this._itemAttributeService.AttributeTypeList().then(result => {
                                this.ItemAttributeTypeList = result as itemattributetypemodel[];
                                this.dataSource = new MatTableDataSource<itemattributetypemodel>(this.ItemAttributeTypeList)
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

    ShowItemAttributeValue(data) {
        this.router.navigate(['/admin/itemattributevalue', {res: this._encryptdecrypt.encrypt(JSON.stringify(data))}])
    }
}
