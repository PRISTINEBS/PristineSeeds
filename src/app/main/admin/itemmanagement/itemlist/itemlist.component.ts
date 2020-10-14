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
import {Itemlist} from "./itemlistmodel";

@Component({
    selector: 'app-itemlist',
    templateUrl: './itemlist.component.html',
    styleUrls: ['./itemlist.component.scss']
})
export class ItemlistComponent implements OnInit {

    displayedColumns: string[] = ['item_no', 'name','item_group', 'main_category', 'sub_category', 'gst_group',
      'hsn_code' ,'class_of_seed','cost_per_unit', 'Edit', 'View'];
    dataSource: MatTableDataSource<Itemlist>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        public sessionManageMent: SessionManageMent,
        private webApiHttp: WebApiHttp,
        private router: Router,
        private _encriptDecript: EncriptDecript,
        private _toster: ToastrService,
        private spinner: NgxSpinnerService
    ) {

    }

    ngOnInit(): void {
        this.item_list();
    }

    item_list() {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemList + this.sessionManageMent.getLocationId).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<Itemlist>(result);
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

    createnewitem() {
        this.router.navigate(['/admin/itemcreation'])
    }

    updateitem(data) {
        this.router.navigate(['/admin/itemcreation', {
            res: this._encriptDecript.encrypt(JSON.stringify(data)),
            type: 'edit'
        }])
    }

    viewinfo(element: any) {
        this.router.navigate(['/admin/itemview', {res: element.item_no}])
    }
}
