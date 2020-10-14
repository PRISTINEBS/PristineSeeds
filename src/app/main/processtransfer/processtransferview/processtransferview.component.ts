import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Purchaseorderviewmodel} from "../../ordermanagement/purchaseorder/purchaseorderview/purchaseorderviewmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {ProcessTransferHeader, ProcessTransferLine} from "../processtransferlist/processtransferlistmodel";

@Component({
  selector: 'app-processtransferview',
  templateUrl: './processtransferview.component.html',
  styleUrls: ['./processtransferview.component.scss']
})
export class ProcesstransferviewComponent implements OnInit {

  process_transfer_no: any;
  process_transfer_header : Array<ProcessTransferHeader> [];
  displayedColumns: string[] = ['lot_no','from_bincode','total_available_bags','total_available_qty',
    'required_bags','required_qty', 'process_loss_qty', 'marketing_lot_no', 'packing_item_code',
    'good_no_of_bags', 'good_qty', 'lint_no_of_bags', 'lint_qty', 'lint_bincode',
    'remenant_no_of_bags', 'remenant_qty', 'remenant_bincode','to_location_code'];

  dataSource: MatTableDataSource<ProcessTransferLine>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private dialog: MatDialog) {
    this.process_transfer_no = this.route.snapshot.paramMap.get('response')
  }

  ngOnInit(): void {
    this.get_process_transfer_info();
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

  get_process_transfer_info() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ProcessTransferInfo + this.process_transfer_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<ProcessTransferLine>(result[0].ptl);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.process_transfer_header = result;
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

}
