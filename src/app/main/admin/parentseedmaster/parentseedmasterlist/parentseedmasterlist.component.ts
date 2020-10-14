import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Varietyqualityparametermodellist} from '../../varietyqualityparameter/varietyqualityparameterlist/varietyqualityparametermodellist';
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
import {Parentseedmasterlistmodel} from './parentseedmasterlistmodel';
import {ParentseedmastercreateComponent} from './parentseedmastercreate/parentseedmastercreate.component';

@Component({
  selector: 'app-parentseedmasterlist',
  templateUrl: './parentseedmasterlist.component.html',
  styleUrls: ['./parentseedmasterlist.component.scss']
})
export class ParentseedmasterlistComponent implements OnInit {

  displayedColumns: string[] = ['item_no','item_name', 'variety_type',
    'parent_seed_code_m','parent_seed_name_m','parent_seed_code_f','parent_seed_name_f',
    'parent_seed_code_o','parent_seed_name_o','Edit', 'Delete'];
  dataSource: MatTableDataSource<Parentseedmasterlistmodel>;
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
    this.dataSource = new MatTableDataSource<Parentseedmasterlistmodel>()
  }

  ngOnInit(): void {
    this.get_ParentSeedMaster();
  }

  get_ParentSeedMaster() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_parent_seed_master).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Parentseedmasterlistmodel>(result);
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
    var dialogConfig = this.dialogActions.open(ParentseedmastercreateComponent, {
      data: {flag: 'insert'},width : '850px'
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.get_ParentSeedMaster();
      }
    })
  }

  OnClickEdit(rowelement: any) {
    var dialogConfig = this.dialogActions.open(ParentseedmastercreateComponent, {
      data: {flag: 'update', row: rowelement},width : '850px'
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.get_ParentSeedMaster();
      }
    })
  }

  OnClickDelete(data: any) {
    var dialogConfig = this.dialogActions.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Are You Sure ! You want to delete Variety Quality Parameter Item No '  + '(' + data.item_no + ')'
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        try {
          const json = {
            item_no: data.item_no,
            flag : 'DELETE',
            created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
          }
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.parent_seed_master_create, json).then(result => {
            if (result[0].condition.toLowerCase() == 'true') {
              this._toasterService.success('success', result[0].message);
              this.get_ParentSeedMaster();
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
