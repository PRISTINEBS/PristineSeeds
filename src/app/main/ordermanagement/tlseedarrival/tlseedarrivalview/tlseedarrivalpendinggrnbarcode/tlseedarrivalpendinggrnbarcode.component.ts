import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-tlseedarrivalpendinggrnbarcode',
  templateUrl: './tlseedarrivalpendinggrnbarcode.component.html',
  styleUrls: ['./tlseedarrivalpendinggrnbarcode.component.scss']
})
export class TlseedarrivalpendinggrnbarcodeComponent implements OnInit {

  displayedColumns: string[] = ['item_no', 'accepted_qty', 'rejected_qty', 'putway_qty', 'vendor_lot_no', 'expire_date'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<TlseedarrivalpendinggrnbarcodeComponent>) {

  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  send() {
    this.dialogRef.close();
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

}
