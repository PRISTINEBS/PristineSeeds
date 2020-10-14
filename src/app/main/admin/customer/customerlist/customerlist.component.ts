import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
    selector: 'app-customerlist',
    templateUrl: './customerlist.component.html',
    styleUrls: ['./customerlist.component.scss']
})

export class CustomerlistComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource: MatTableDataSource<any>;
    displayedColumns: Array<string> = ["customer_name","email","mobile_number","pan_number","gst_type","gst_number","Edit","View"];

    length = 0;
    RowsPerPage = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    PageNumber = 0;
    filter_dynamic: Array<{ filterKey: string, filter_value: string }> = [];

    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private router: Router,
                private _encriptDecript: EncriptDecript,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
        this.customer_list('');
    }

    customer_list(query: string) {
        try {
            this.spinner.show();
            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CustomerList ).then(
                result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<any>(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
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

    createnewitem() {
        this.router.navigate(['/admin/customercreate'])
    }

    updateitem(data) {
        this.router.navigate(['/admin/customercreate', {
            res: this._encriptDecript.encrypt(JSON.stringify(data)),
            type: 'edit'
        }])
    }

    viewinfo(element: any) {
        this.router.navigate(['/admin/customerview', {res: element.customer_id}])
    }


    //exp
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
  myPagginaterEvent(event) {
        this.spinner.show();
        this.RowsPerPage = event.pageSize;
        this.PageNumber = event.pageIndex;
        this.applyFilter('', '');
    }

}
