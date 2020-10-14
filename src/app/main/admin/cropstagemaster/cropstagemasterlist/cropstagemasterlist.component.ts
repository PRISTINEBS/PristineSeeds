import {Component, OnInit, ViewChild} from '@angular/core';
import {Itemcategorymodel} from '../../itemmanagement/itemcategory/itemcategorymodel';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {MatDialog} from '@angular/material/dialog';
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {pristineConfirmDialogComponent} from '../../../../../@pristine/components/confirm-dialog/confirm-dialog.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {Cropstagemasterlistmodel} from './cropstagemasterlistmodel';
import {CropstagemastercreateComponent} from './cropstagemastercreate/cropstagemastercreate.component';

@Component({
  selector: 'app-cropstagemasterlist',
  templateUrl: './cropstagemasterlist.component.html',
  styleUrls: ['./cropstagemasterlist.component.scss']
})
export class CropstagemasterlistComponent implements OnInit {

  displayedColumns: string[] = ['crop_code','stage', 'sequence', 'description',
    'got_test','bt_elisa_test', 'stl_germination_test', 'stl_physical_purity',
    'stl_moisture', 'stl_vigour', 'Edit'];
  dataSource: MatTableDataSource<Cropstagemasterlistmodel>;
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
    this.dataSource = new MatTableDataSource<Cropstagemasterlistmodel>()
  }

  ngOnInit(): void {
    this.get_CropStageMaster();
  }

  get_CropStageMaster() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetCropStageMaster).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Cropstagemasterlistmodel>(result);
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
    var dialogConfig = this.dialogActions.open(CropstagemastercreateComponent, {
      data: {flag: 'insert'} , width : "700px"
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.get_CropStageMaster();
      }
    })
  }

  OnClickEdit(rowelement: any) {
    var dialogConfig = this.dialogActions.open(CropstagemastercreateComponent, {
      data: {flag: 'update', row: rowelement}
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.get_CropStageMaster();
      }
    })
  }

  OnClickDelete(data: any) {
    var dialogConfig = this.dialogActions.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Are You Sure ! You want to delete crop stage master crop code '  + '(' + data.crop_code + ')' + ' stage ' + '(' + data.stage + ')'
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        try {
          const json = {
            crop_code: data.crop_code,
            stage: data.stage,
            flag : 'DELETE',
            created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
          }
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.crop_stage_master_create, json).then(result => {
            if (result[0].condition.toLowerCase() == 'true') {
              this._toasterService.success('success', result[0].message);
              this.get_CropStageMaster();
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
