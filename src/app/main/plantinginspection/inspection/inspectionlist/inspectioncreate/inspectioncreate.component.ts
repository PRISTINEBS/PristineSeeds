import {Component, OnInit, ViewChild} from '@angular/core';
import {fsio_no_model, get_fsio_no, Plantingviewmodel, production_generate} from '../../../planting/plantingview/plantingviewmodel';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionManageMent} from '../../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {Inspectioncreatemodel} from './inspectioncreatemodel';
import {MatDialog} from '@angular/material/dialog';
import {ViewinspectionComponent} from './viewinspection/viewinspection.component';

@Component({
  selector: 'app-inspectioncreate',
  templateUrl: './inspectioncreate.component.html',
  styleUrls: ['./inspectioncreate.component.scss']
})
export class InspectioncreateComponent implements OnInit {

  dataSource: MatTableDataSource<Inspectioncreatemodel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['select','planting_no','production_lot_no','season','fsio_no',
    'organiser_code','organiser_name','grower_no','grower_name','item_no','item_name',
    'category','sub_category','class_of_seed','crop_type','class_of_variety'];

  scan_production_lot_no = new FormControl();

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private datePipe: DatePipe,
              private dialogActions: MatDialog,) {

  }

  ngOnInit(): void {
  }

  get_production_lot_no() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.scanProductionLotNo+this.scan_production_lot_no.value).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.dataSource = new MatTableDataSource<Inspectioncreatemodel>(result);
            this.dataSource.paginator = this.paginator
            this.dataSource.sort = this.sort
          } else {
            this.scan_production_lot_no.setValue('')
            this._toster.info(result[0].message, 'Info');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Exception');
    }
  }

  applyFilter(filterValue: string, keyName: string) {
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false;
      }
    };
  }

  OnClickEdit(rowelement : any){
    // var dialogConfig = this.dialogActions.open(ViewinspectionComponent, {
    //   data: {row: rowelement},width : '800px'
    // })
    // dialogConfig.afterClosed().subscribe(result => {
    //   if (result == 'true') {
    //
    //   }
    // })


    this.router.navigate(['/plantinginspection/createinspection1',
      {res:this._encriptDecript.encrypt(JSON.stringify(rowelement))}]);

  }

}
