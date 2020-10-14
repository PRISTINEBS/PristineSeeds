import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Cropstagemasterlistmodel} from '../../cropstagemaster/cropstagemasterlist/cropstagemasterlistmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {pristineConfirmDialogComponent} from '../../../../../@pristine/components/confirm-dialog/confirm-dialog.component';
import {Varietyqualityparametermodellist} from './varietyqualityparametermodellist';
import {VarietyqualityparametercreateComponent} from './varietyqualityparametercreate/varietyqualityparametercreate.component';

@Component({
  selector: 'app-varietyqualityparameterlist',
  templateUrl: './varietyqualityparameterlist.component.html',
  styleUrls: ['./varietyqualityparameterlist.component.scss']
})
export class VarietyqualityparameterlistComponent implements OnInit {

  displayedColumns: string[] = ['item_no','parameter', 'value', 'parameter_value_calc',
    'type', 'Edit', 'Delete'];
  dataSource: MatTableDataSource<Varietyqualityparametermodellist>;
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
    this.dataSource = new MatTableDataSource<Varietyqualityparametermodellist>()
  }

  ngOnInit(): void {
    this.get_VarietyQualityParameter();
  }

  get_VarietyQualityParameter() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_variety_wise_quality_parameter).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Varietyqualityparametermodellist>(result);
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
    var dialogConfig = this.dialogActions.open(VarietyqualityparametercreateComponent, {
      data: {flag: 'insert'},width : '800px'
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.get_VarietyQualityParameter();
      }
    })
  }

  OnClickEdit(rowelement: any) {
    var dialogConfig = this.dialogActions.open(VarietyqualityparametercreateComponent, {
      data: {flag: 'update', row: rowelement},width : '800px'
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.get_VarietyQualityParameter();
      }
    })
  }

  OnClickDelete(data: any) {
    var dialogConfig = this.dialogActions.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Are You Sure ! You want to delete Variety Quality Parameter Item No '  + '(' + data.item_no + ')' + ' Parameter ' + '(' + data.parameter + ')'
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        try {
          const json = {
            id: data.id,
            flag : 'DELETE',
            created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
          }
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.variety_wise_quality_parameter_create, json).then(result => {
            if (result[0].condition.toLowerCase() == 'true') {
              this._toasterService.success('success', result[0].message);
              this.get_VarietyQualityParameter();
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
