import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Varietyqualityparametermodellist} from '../../../admin/varietyqualityparameter/varietyqualityparameterlist/varietyqualityparametermodellist';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {Plantinglistmodel} from './plantinglistmodel';
import {PlantingcreateComponent} from './plantingcreate/plantingcreate.component';

@Component({
  selector: 'app-plantinglist',
  templateUrl: './plantinglist.component.html',
  styleUrls: ['./plantinglist.component.scss']
})
export class PlantinglistComponent implements OnInit {

  displayedColumns: string[] = ['planting_no','status_name', 'organiser_code', 'organiser_name',
    'season','fsio_no','category','stage', 'Edit'];
  dataSource: MatTableDataSource<Plantinglistmodel>;
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
    this.dataSource = new MatTableDataSource<Plantinglistmodel>()
  }

  ngOnInit(): void {
    this.get_planting_list();
  }

  get_planting_list() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_planting_list).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Plantinglistmodel>(result);
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
    var dialogConfig = this.dialogActions.open(PlantingcreateComponent, {
      width : '800px'
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
      }
    })
  }

  OnClickEdit(rowelement : any){
    this.router.navigate(['/plantinginspection/plantingview', {res: this._encryptdecrypt.encrypt('{"planting_no":"' + rowelement.planting_no + '"}')}])
  }

}
