import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Inspectionlistmodel} from '../inspectionlist/inspectionlistmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-inspectionqclist',
  templateUrl: './inspectionqclist.component.html',
  styleUrls: ['./inspectionqclist.component.scss']
})
export class InspectionqclistComponent implements OnInit {

  displayedColumns: string[] = ['inspection_no','planting_no','status_name', 'organiser_code', 'organiser_name',
    'season','address','mobile_no', 'Edit'];
  dataSource: MatTableDataSource<Inspectionlistmodel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router: Router,
              private webApiHttp: WebApiHttp,
              public sessionManageMent: SessionManageMent,
              private _toasterService: ToastrService,
              private _encryptdecrypt: EncriptDecript,
              private dialogActions: MatDialog,
              private spinner: NgxSpinnerService
  ) {
    this.dataSource = new MatTableDataSource<Inspectionlistmodel>()
  }

  ngOnInit(): void {
    this.get_inspection_four_list();
  }

  get_inspection_four_list() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_inspection_qc_list).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Inspectionlistmodel>(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this._toasterService.info(result[0].message, 'Info')
        }
        this.spinner.hide();
      }).catch(error => {
        this._toasterService.error(error, 'Error')
        this.spinner.hide();
      })
    } catch (e) {
      this._toasterService.error(e, 'Error')
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

  OnClickNew() {
    this.router.navigate(['/plantinginspection/createinspectionqc']);
  }

  OnClickEdit(rowelement : any){
    this.router.navigate(['/plantinginspection/createinspectionqc', {inspection_no: this._encryptdecrypt.encrypt(rowelement.inspection_no)}])
  }

}
