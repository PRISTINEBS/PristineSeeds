import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {Createinspectionqcmodel, Updateinspectionqcmodel} from './createinspectionqcmodel';

@Component({
  selector: 'app-createinspectionqc',
  templateUrl: './createinspectionqc.component.html',
  styleUrls: ['./createinspectionqc.component.scss']
})
export class CreateinspectionqcComponent implements OnInit {

  scan_production_lot_no = new FormControl();
  // inspection_form: FormGroup;
  scan_prod : boolean = true;
  brow_insp_no : string = '';
  minDateexp : any = '';
  crop_condition : string[] = ['Bad','Medium','Good'];
  crop_stage : string[] = ['Germination','Vegetative'];
  pervious_crop : string[] = ['Bajra','Cluster Beans','cotton','Cowpea','Maize','Mustard','paddy','Wheat'];
  isolation_distance : string[] = ['Maintained','Non-Maintained'];


  dataSource: MatTableDataSource<Createinspectionqcmodel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['production_lot_no','grower_no', 'grower_name','item_no','item_name',
    'category','sub_category','item_class_of_seeds','item_crop_type', 'date_of_inspection',
    'crop_condition','crop_stage','suggestion_to_grower', 'avg_crossing_per_day','avg_cross_boll_per_plant',
    'self_boll_per_plant','kapas_picking_if_any','approx_kapas_balance_for_picking',
    'estimated_field_in_kg','name_of_fertilizer','fertilizer_date','fertilizer_dose',
    'sprying_fungi_or_insecticide_date','name_of_insecticide_or_fungicide',
    'sprying_fungi_or_Insecticide_dose','plants_rouged_male','plants_rouged_female','previousCrop',
    'givenArea','rejection_PLDArea','actualArea','crossingStartDate','plantPopulationVariety',
    'plantPopulationFemale','spacingFemaleRow','spacingFemalePlant','isolationDistanceStatus',
    'isolationDistanceinMetre','spacingVarietyRow','spacingVarietyPlant','crossingEndDate','Action'];

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

  get_actual_area(row_element : any){
    try {
      let actual_area : number = 0;

      if(row_element.item_crop_type.toLowerCase() == 'improved'){
        actual_area = parseFloat((((row_element.spacingVarietyRow *
          row_element.spacingVarietyPlant *
          row_element.plantPopulationVariety)/1000) - row_element.rejection_PLDArea ).toFixed(2));
        return actual_area;
      }else if(row_element.item_crop_type.toLowerCase() == 'hybrid'){
        actual_area = parseFloat((((row_element.spacingFemaleRow *
          row_element.spacingFemalePlant *
          row_element.plantPopulationFemale)/1000) - row_element.rejection_PLDArea).toFixed(2));
        return actual_area;
      }
    }catch (e) {
      return 0;
    }
  }

  get_inspection_details(inspection_no) {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_inspection_qc_info+inspection_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Createinspectionqcmodel>(result);
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
        flag : 'INSPQC'
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.scanProductionLotNo,json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.scan_production_lot_no.setValue('')
            this.dataSource = new MatTableDataSource<Createinspectionqcmodel>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.brow_insp_no = this.dataSource?.data[0]?.inspection_no;
            this.router.navigate(['/plantinginspection/createinspectionqc', {inspection_no: this._encriptDecript.encrypt(this.dataSource?.data[0]?.inspection_no)}])
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

      var createinspectionqc : Array<Updateinspectionqcmodel> = [];

      for(let i=0;i<this.dataSource.data.length;i++){

        var json = {
          line_no : this.dataSource.data[i].line_no,
          date_of_inspection : this.dataSource.data[i].date_of_inspection,
          crop_condition : this.dataSource.data[i].crop_condition,
          crop_stage : this.dataSource.data[i].crop_stage,
          suggestion_to_grower : this.dataSource.data[i].suggestion_to_grower,
          avg_crossing_per_day : this.dataSource.data[i].avg_crossing_per_day,
          avg_cross_boll_per_plant : this.dataSource.data[i].avg_cross_boll_per_plant,
          self_boll_per_plant : this.dataSource.data[i].self_boll_per_plant,
          kapas_picking_if_any : this.dataSource.data[i].kapas_picking_if_any,
          approx_kapas_balance_for_picking : this.dataSource.data[i].approx_kapas_balance_for_picking,
          estimated_field_in_kg : this.dataSource.data[i].estimated_field_in_kg,
          name_of_fertilizer : this.dataSource.data[i].name_of_fertilizer,
          fertilizer_date : this.dataSource.data[i].fertilizer_date,
          fertilizer_dose : this.dataSource.data[i].fertilizer_dose,
          sprying_fungi_or_insecticide_date : this.dataSource.data[i].sprying_fungi_or_insecticide_date,
          name_of_insecticide_or_fungicide : this.dataSource.data[i].name_of_insecticide_or_fungicide,
          sprying_fungi_or_Insecticide_dose : this.dataSource.data[i].sprying_fungi_or_Insecticide_dose,
          plants_rouged_male : this.dataSource.data[i].plants_rouged_male,
          plants_rouged_female : this.dataSource.data[i].plants_rouged_female,
          rejection_PLDArea : this.dataSource.data[i].rejection_PLDArea,
          actualArea : this.dataSource.data[i].actualArea,
          crossingStartDate : this.dataSource.data[i].crossingStartDate,
          plantPopulationVariety : this.dataSource.data[i].plantPopulationVariety,
          plantPopulationFemale : this.dataSource.data[i].plantPopulationFemale,
          spacingFemaleRow : this.dataSource.data[i].spacingFemaleRow,
          spacingFemalePlant : this.dataSource.data[i].spacingFemalePlant,
          isolationDistanceStatus : this.dataSource.data[i].isolationDistanceStatus,
          isolationDistanceinMetre : this.dataSource.data[i].isolationDistanceinMetre,
          spacingVarietyRow : this.dataSource.data[i].spacingVarietyRow,
          spacingVarietyPlant : this.dataSource.data[i].spacingVarietyPlant,
          crossingEndDate : this.dataSource.data[i].crossingEndDate,
        }
        createinspectionqc.push(json)
      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: null,
        lines: createinspectionqc
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_qc_line, posted_json).then(
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_qc+row_element.line_no).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.dataSource.data.splice(this.dataSource.data.indexOf(row_element), 1);
            this.dataSource = new MatTableDataSource<Createinspectionqcmodel>(this.dataSource.data);
            if(this.dataSource.data.length == 0){
              this.delete_header(this.brow_insp_no);
              this.brow_insp_no = null;
              this.dataSource.data = [];
              this.router.navigate(['/plantinginspection/createinspectionqc'])
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_qc_header+inspection_no).then(
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

      var createinspectionqc : Array<Updateinspectionqcmodel> = [];

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
          suggestion_to_grower : this.dataSource.data[i].suggestion_to_grower,
          avg_crossing_per_day : this.dataSource.data[i].avg_crossing_per_day,
          avg_cross_boll_per_plant : this.dataSource.data[i].avg_cross_boll_per_plant,
          self_boll_per_plant : this.dataSource.data[i].self_boll_per_plant,
          kapas_picking_if_any : this.dataSource.data[i].kapas_picking_if_any,
          approx_kapas_balance_for_picking : this.dataSource.data[i].approx_kapas_balance_for_picking,
          estimated_field_in_kg : this.dataSource.data[i].estimated_field_in_kg,
          name_of_fertilizer : this.dataSource.data[i].name_of_fertilizer,
          fertilizer_date : this.dataSource.data[i].fertilizer_date,
          fertilizer_dose : this.dataSource.data[i].fertilizer_dose,
          sprying_fungi_or_insecticide_date : this.dataSource.data[i].sprying_fungi_or_insecticide_date,
          name_of_insecticide_or_fungicide : this.dataSource.data[i].name_of_insecticide_or_fungicide,
          sprying_fungi_or_Insecticide_dose : this.dataSource.data[i].sprying_fungi_or_Insecticide_dose,
          plants_rouged_male : this.dataSource.data[i].plants_rouged_male,
          plants_rouged_female : this.dataSource.data[i].plants_rouged_female,
          rejection_PLDArea : this.dataSource.data[i].rejection_PLDArea,
          actualArea : this.dataSource.data[i].actualArea,
          crossingStartDate : this.dataSource.data[i].crossingStartDate,
          plantPopulationVariety : this.dataSource.data[i].plantPopulationVariety,
          plantPopulationFemale : this.dataSource.data[i].plantPopulationFemale,
          spacingFemaleRow : this.dataSource.data[i].spacingFemaleRow,
          spacingFemalePlant : this.dataSource.data[i].spacingFemalePlant,
          isolationDistanceStatus : this.dataSource.data[i].isolationDistanceStatus,
          isolationDistanceinMetre : this.dataSource.data[i].isolationDistanceinMetre,
          spacingVarietyRow : this.dataSource.data[i].spacingVarietyRow,
          spacingVarietyPlant : this.dataSource.data[i].spacingVarietyPlant,
          crossingEndDate : this.dataSource.data[i].crossingEndDate,
        }
        createinspectionqc.push(json)
      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: this.sessionManageMent.getEmail,
        lines: createinspectionqc
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_qc_line, posted_json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.router.navigate(['/plantinginspection/inspectionqclist'])
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
