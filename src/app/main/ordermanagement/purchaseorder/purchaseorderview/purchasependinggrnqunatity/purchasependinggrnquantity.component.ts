import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Purchaseorderviewmodel} from "../purchaseorderviewmodel";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {NgxSpinnerService} from "ngx-spinner";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";

@Component({
    selector: 'app-purchasependinggrnquantity',
    templateUrl: './purchasependinggrnquantity.component.html',
    styleUrls: ['./purchasependinggrnquantity.component.scss']
})
export class PurchasependinggrnquantityComponent implements OnInit {

    displayedColumns: string[] = ['item_no','stage','lot_no','no_of_bags','applied_no_of_bags', 'quantity','accepted_quantity','pending_no_of_bags','pending_grn_quantity'];
    dataSource_pending_grn: MatTableDataSource<Purchaseorderviewmodel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private _toster: ToastrService,
                private webApiHttp: WebApiHttp,
                private spinner: NgxSpinnerService,
                public sessionManageMent: SessionManageMent,
                public dialogRef: MatDialogRef<PurchasependinggrnquantityComponent>) {

    }

    ngOnInit(): void {
        this.dataSource_pending_grn = new MatTableDataSource<Purchaseorderviewmodel>(this.data);
        this.dataSource_pending_grn.paginator = this.paginator;
        this.dataSource_pending_grn.sort = this.sort;
    }

    send() {
        this.dialogRef.close();
    }

    confirm(){
      console.log(this.dataSource_pending_grn.data);
      try {
        this.spinner.show();
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.grn_putaway_auto_create,
          {PurchaseOrderNo: this.dataSource_pending_grn.data[0].document_no,
            CreatedBy: this.sessionManageMent.getEmail,
            lines: this.dataSource_pending_grn.data
          }
        ).then(result => {
          if (result[0].condition == 'True') {
            this.spinner.hide();
            this.dialogRef.close(true);
            this._toster.success(result[0].message, 'Success')
          } else {
            this._toster.error(result[0].message, 'Error')
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

  change_pending_no_of_bags(row_element: any,i:number){
    if(row_element.pending_no_of_bags>(row_element.no_of_bags - row_element.applied_no_of_bags)){
      this._toster.warning('Pending No Of Bags Can Not Be Greater Than No Of Bags ('+row_element.no_of_bags+
        ') - Applied No of Bags ('+row_element.applied_no_of_bags+') = ' +
        (row_element.no_of_bags - row_element.applied_no_of_bags), 'Warning');
      this.dataSource_pending_grn.data[i].pending_no_of_bags=(row_element.no_of_bags - row_element.applied_no_of_bags);
    }
  }

    change_pending_grn_qty(row_element: any,i:number){
      if(row_element.pending_grn_quantity>(row_element.quantity - row_element.accepted_quantity)){
        this._toster.warning('Pending Grn Quantity Can Not Be Greater Than Quantity ('+row_element.quantity+
          ') - Accepted Quantity ('+row_element.accepted_quantity+') = ' +
          (row_element.quantity - row_element.accepted_quantity), 'Warning');
        this.dataSource_pending_grn.data[i].pending_grn_quantity = (row_element.quantity - row_element.accepted_quantity)
      }
    }

    applyFilter(filterValue: string, keyName: string) {
        this.dataSource_pending_grn.filter = filterValue;
        this.dataSource_pending_grn.filterPredicate = function (data, filter: string): boolean {
            if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
                return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
            } else {
                return false
            }

        };
    }
}
