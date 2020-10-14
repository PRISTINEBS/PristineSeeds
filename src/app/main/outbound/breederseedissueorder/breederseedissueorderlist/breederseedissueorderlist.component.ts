import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {Breederseedissueorderlist} from "./breederseedissueorderlist";

@Component({
    selector: 'app-breederseedissueorderlist',
    templateUrl: './breederseedissueorderlist.component.html',
    styleUrls: ['./breederseedissueorderlist.component.scss']
})
export class BreederseedissueorderlistComponent implements OnInit {

    search: FormGroup
    displayedColumns: string[] = ['document_no', 'customer_no','order_datetime',
      'order_status','total_no_of_bags','total_quantity','total_amount','View'];
    dataSource: MatTableDataSource<Breederseedissueorderlist>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;


    constructor(public sessionManageMent: SessionManageMent,
                private webApiHttp: WebApiHttp,
                private router: Router,
                private _encriptDecript: EncriptDecript,
                private _toster: ToastrService,
                private spinner: NgxSpinnerService,
                private _formgroup: FormBuilder,
                private _date: DatePipe) {

    }

    ngOnInit(): void {
        this.get_BSIO_List()
    }

    create_sale_order() {
        this.router.navigateByUrl('/outbound/breederseedissueordercreate');
    }

    get_BSIO_List() {
        try {
            this.spinner.show();

            this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetBSIOList+this.sessionManageMent.getLocationId).then(result => {
              console.log(result)
                if (result[0].condition == 'True') {
                    this.dataSource = new MatTableDataSource<Breederseedissueorderlist>(result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                } else {
                    this._toster.info(result[0].message, 'Info')
                }
                this.spinner.hide();
            }).catch(error => {
                this._toster.error(error, 'Error')
                this.spinner.hide();
            })
        } catch (e) {
            this._toster.error(e, 'Error')
            this.spinner.show();
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
        //this.router.navigate(['outbound/deliveryorderview', {response: e.document_no}]);
    }

    Search() {

    }
}
