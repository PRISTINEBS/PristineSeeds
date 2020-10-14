import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {Createinspection3model, Updateinspection3model} from '../../inspectionthreelist/createinspection3/createinspection3model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {Createinspection4model, Updateinspection4model} from './createinspection4model';

@Component({
  selector: 'app-createinspection4',
  templateUrl: './createinspection4.component.html',
  styleUrls: ['./createinspection4.component.scss']
})
export class Createinspection4Component implements OnInit {

  scan_production_lot_no = new FormControl();
  // inspection_form: FormGroup;
  scan_prod : boolean = true;
  brow_insp_no : string = '';
  minDateexp : any = '';
  crop_condition : string[] = ['Bad','Medium','Good'];
  crop_stage : string[] = ['Germination','Vegetative'];


  dataSource: MatTableDataSource<Createinspection4model>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['production_lot_no','grower_no', 'grower_name','item_no','item_name',
    'category','sub_category','item_class_of_seeds','item_crop_type', 'date_of_inspection',
    'crop_condition','crop_stage','net_area_as_per_insp_3', 'crossing_start_date','crossing_end_date',
    'final_plant_population','avg_cross_boll_per_plant','kapas_picking_if_any','approx_kapas_balance_for_picking',
    'estimated_field_in_kg','other_specific_observations','suggestion_to_grower','harvestingDateMale',
    'harvestingDateFemale','harvestingDateOther','Action'];

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private datePipe: DatePipe) {

    // this.inspection_form = _formBuilder.group({
    //   inspectionDate : ['', Validators.required],
    //   isolationDistance: ['', Validators.required],
    //   isolationDistanceInM: [0, Validators.required],
    //   previousCrop: ['', Validators.required],
    //   germinationStatus: ['', Validators.required],
    //   germinationPer: [0, Validators.required],
    //   area: [0, Validators.required],
    //   rejectedArea: [0, Validators.required],
    //   netArea: [0, Validators.required],
    //   spacingVariety: [0, Validators.required],
    //   spacingMale: [0, Validators.required],
    //   spacingFemale: [0, Validators.required],
    //   plantPopulationVariety: [0, Validators.required],
    //   plantPopulationMale: [0, Validators.required],
    //   plantPopulationFemale: [0, Validators.required],
    //   cropCondition: ['', Validators.required],
    //   cropStage: ['', Validators.required],
    //   suggestionGrower: ['', Validators.required],
    //   spacingVarietyRow: [0, Validators.required],
    //   spacingVarietyPlant: [0, Validators.required],
    //   spacingMaleRow: [0, Validators.required],
    //   spacingMalePlant: [0, Validators.required],
    //   spacingFemaleRow: [0, Validators.required],
    //   spacingFemalePlant: [0, Validators.required],
    // });

    try{
      this.brow_insp_no = this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('inspection_no'));
    }catch (e) {}

  }

  ngOnInit(): void {

    if(this.brow_insp_no != '' && this.brow_insp_no != null && this.brow_insp_no != undefined){
      this.get_inspection_details(this.brow_insp_no)
    }

  }

  setestimatedFieldInKG(row_element : any,flag : string){
    try{
      if(flag == 'kapas'){
        if(row_element.kapas_picking_if_any < 0){
          this._toster.info('Kapas Picking If Any (' + row_element.kapas_picking_if_any +
            ') can not be less than Zero of production lot no ' + row_element.production_lot_no, 'Info');
          row_element.kapas_picking_if_any = 0;
          return;
        }
      }else if(flag == 'approx'){
        if(row_element.approx_kapas_balance_for_picking < 0){
          this._toster.info('Approx Kapas Balance For Picking (' + row_element.approx_kapas_balance_for_picking +
            ') can not be less than Zero of production lot no ' + row_element.production_lot_no, 'Info');
          row_element.approx_kapas_balance_for_picking = 0;
          return;
        }
      }
      row_element.estimated_field_in_kg = row_element.kapas_picking_if_any + row_element.approx_kapas_balance_for_picking;
    }catch (e) {
      return 0;
    }
  }

  get_inspection_details(inspection_no) {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_inspection_four_info+inspection_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Createinspection4model>(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if(this.dataSource.data[0].status_name == 'Completed'){
            this.scan_prod = false;
          }
        } else {
          this._toster.error(result[0].message, 'Error');
        }
        this.spinner.hide();
      }).catch(e => {
        this._toster.error(e, 'Error');
        this.spinner.hide();
      })
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }

  get_production_lot_no() {
    try {
      this.spinner.show();

      let insp_no : string = null

      try{
        insp_no = this.dataSource?.data[0]?.inspection_no
      }catch (e) {}

      const json : any = {
        insp_no: insp_no,
        production_lot_no : this.scan_production_lot_no.value,
        created_by : this.sessionManageMent.getEmail,
        flag : 'INSP4'
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.scanProductionLotNo,json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.scan_production_lot_no.setValue('')
            this.dataSource = new MatTableDataSource<Createinspection4model>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.brow_insp_no = this.dataSource?.data[0]?.inspection_no;
            this.router.navigate(['/plantinginspection/createinspection4', {inspection_no: this._encriptDecript.encrypt(this.dataSource?.data[0]?.inspection_no)}])
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

  update_all_production_lot_no(){
    try{

      var createinspection4 : Array<Updateinspection4model> = [];

      for(let i=0;i<this.dataSource.data.length;i++){

        var json = {
          line_no : this.dataSource.data[i].line_no,
          date_of_inspection : this.dataSource.data[i].date_of_inspection,
          crop_condition : this.dataSource.data[i].crop_condition,
          crop_stage : this.dataSource.data[i].crop_stage,
          crossing_start_date : this.dataSource.data[i].crossing_start_date,
          crossing_end_date : this.dataSource.data[i].crossing_end_date,
          final_plant_population : this.dataSource.data[i].final_plant_population,
          avg_cross_boll_per_plant : this.dataSource.data[i].avg_cross_boll_per_plant,
          kapas_picking_if_any : this.dataSource.data[i].kapas_picking_if_any,
          approx_kapas_balance_for_picking : this.dataSource.data[i].approx_kapas_balance_for_picking,
          estimated_field_in_kg : this.dataSource.data[i].estimated_field_in_kg,
          other_specific_observations : this.dataSource.data[i].other_specific_observations,
          suggestion_to_grower : this.dataSource.data[i].suggestion_to_grower,
          harvestingDateMale : this.dataSource.data[i].harvestingDateMale,
          harvestingDateFemale : this.dataSource.data[i].harvestingDateFemale,
          harvestingDateOther : this.dataSource.data[i].harvestingDateOther,
        }
        createinspection4.push(json)
      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: null,
        lines: createinspection4
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_four_line, posted_json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
          } else {
            this._toster.info(result[0].message, 'Info');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });

    }catch (e) {
    }
  }

  delete_line_barcode(row_element : any){
    try {
      if(row_element.line_no == '' || row_element.line_no ==  null){
        this._toster.info('No Record For Deletion', 'Info');
        return;
      }
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_four+row_element.line_no).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.dataSource.data.splice(this.dataSource.data.indexOf(row_element), 1);
            this.dataSource = new MatTableDataSource<Createinspection4model>(this.dataSource.data);
            if(this.dataSource.data.length == 0){
              this.delete_header(this.brow_insp_no);
              this.brow_insp_no = null;
              this.dataSource.data = [];
              this.router.navigate(['/plantinginspection/createinspection4'])
            }
          } else {
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


  delete_header(inspection_no : string){
    try {
      console.log(inspection_no)
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_four_header+inspection_no).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
          }
        }).catch(error => {
      });
    } catch (e) {
    }
  }


  submit_inspection(){
    try{

      var createinspection4 : Array<Updateinspection4model> = [];

      for(let i=0;i<this.dataSource.data.length;i++){

        if(this.dataSource.data[i].date_of_inspection == null
         || this.dataSource.data[i].date_of_inspection == ''){
          this._toster.info('Please Fill Date Of Inspection of Production Lot No '
            +this.dataSource.data[i].production_lot_no, 'Info');
          return;
        }

        var json = {
          line_no : this.dataSource.data[i].line_no,
          date_of_inspection : this.dataSource.data[i].date_of_inspection,
          crop_condition : this.dataSource.data[i].crop_condition,
          crop_stage : this.dataSource.data[i].crop_stage,
          crossing_start_date : this.dataSource.data[i].crossing_start_date,
          crossing_end_date : this.dataSource.data[i].crossing_end_date,
          final_plant_population : this.dataSource.data[i].final_plant_population,
          avg_cross_boll_per_plant : this.dataSource.data[i].avg_cross_boll_per_plant,
          kapas_picking_if_any : this.dataSource.data[i].kapas_picking_if_any,
          approx_kapas_balance_for_picking : this.dataSource.data[i].approx_kapas_balance_for_picking,
          estimated_field_in_kg : this.dataSource.data[i].estimated_field_in_kg,
          other_specific_observations : this.dataSource.data[i].other_specific_observations,
          suggestion_to_grower : this.dataSource.data[i].suggestion_to_grower,
          harvestingDateMale : this.dataSource.data[i].harvestingDateMale,
          harvestingDateFemale : this.dataSource.data[i].harvestingDateFemale,
          harvestingDateOther : this.dataSource.data[i].harvestingDateOther,
        }
        createinspection4.push(json)
      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: this.sessionManageMent.getEmail,
        lines: createinspection4
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_four_line, posted_json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.router.navigate(['/plantinginspection/inspectionfourlist'])
          } else {
            this._toster.info(result[0].message, 'Info');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });

    }catch (e) {
    }
  }

}
