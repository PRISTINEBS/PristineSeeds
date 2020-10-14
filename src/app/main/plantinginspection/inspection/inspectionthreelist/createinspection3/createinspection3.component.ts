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
import {Createinspection3model, Updateinspection3model} from './createinspection3model';

@Component({
  selector: 'app-createinspection3',
  templateUrl: './createinspection3.component.html',
  styleUrls: ['./createinspection3.component.scss']
})
export class Createinspection3Component implements OnInit {

  scan_production_lot_no = new FormControl();
  // inspection_form: FormGroup;
  scan_prod : boolean = true;
  brow_insp_no : string = '';
  minDateexp : any = '';
  crop_condition : string[] = ['Bad','Medium','Good'];
  crop_stage : string[] = ['Germination','Vegetative'];


  dataSource: MatTableDataSource<Createinspection3model>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['production_lot_no','grower_no', 'grower_name','item_no','item_name',
    'category','sub_category','item_class_of_seeds','item_crop_type','sowing_date_other',
    'sowing_date_female', 'date_of_inspection','durationofCrop',
    'crop_condition','crop_stage','net_area_as_per_insp2', 'not_cross_area','net_cross_area',
    'crossing_start_date','avg_crossing_per_day','self_boll_per_plant','crossing_end_date',
    'kapas_picking_if_any','name_of_fertilizer','fertilizer_date','fertilizer_dose',
    'sprying_fungi_or_insecticide_date','name_of_insecticide_or_fungicide',
    'sprying_fungi_or_insecticide_dose','other_specific_observations',
    'suggestion_to_grower','Action'];

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

  setDurationCrop(row_element : any){
    try{
      let date_inspection = new Date(row_element.date_of_inspection);

      if(row_element.item_crop_type.toLowerCase() == 'improved'){

        let sowing_date = new Date(row_element.sowing_date_other);

        row_element.durationofCrop = Math.floor((Date.UTC(date_inspection.getFullYear(), date_inspection.getMonth(), date_inspection.getDate()) -
          Date.UTC(sowing_date.getFullYear(), sowing_date.getMonth(), sowing_date.getDate()) ) /(1000 * 60 * 60 * 24));


      }else if(row_element.item_crop_type.toLowerCase() == 'hybrid'){

        let sowing_date = new Date(row_element.sowing_date_female);

        row_element.durationofCrop = Math.floor((Date.UTC(date_inspection.getFullYear(), date_inspection.getMonth(), date_inspection.getDate()) -
          Date.UTC(sowing_date.getFullYear(), sowing_date.getMonth(), sowing_date.getDate()) ) /(1000 * 60 * 60 * 24));

      }
    }catch (e) {
      console.log(e.message);
      row_element.durationofCrop = 0;
    }
  }

  setNotCrossArea(row_element : any){
    try {
      if(row_element.not_cross_area < 0){
        this._toster.info('Not Cross Area (' + row_element.not_cross_area +
          ') can not be less than Zero of production lot no ' + row_element.production_lot_no, 'Info');
        row_element.not_cross_area = 0;
        return;
      }
      if(row_element.not_cross_area > row_element.net_area_as_per_insp2){
        this._toster.info('Not Cross Area (' + row_element.not_cross_area +
          ') can not be greater than Inspection 2 Net Area (' +row_element.net_area_as_per_insp2+
          ') of production lot no ' + row_element.production_lot_no, 'Info');
        row_element.not_cross_area = 0;
      }
    }catch (e) {
      return 0;
    }
  }

  get_net_area(row_element : any){
    try {
      let net_area : number = row_element.net_area_as_per_insp2 - row_element.not_cross_area;
      if(net_area < 0){
        return 0;
      }else{
        return net_area;
      }
    }catch (e) {
      return 0;
    }
  }

  get_inspection_details(inspection_no) {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_inspection_three_info+inspection_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Createinspection3model>(result);
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
        flag : 'INSP3'
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.scanProductionLotNo,json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.scan_production_lot_no.setValue('')
            this.dataSource = new MatTableDataSource<Createinspection3model>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.brow_insp_no = this.dataSource?.data[0]?.inspection_no;
            this.router.navigate(['/plantinginspection/createinspection3', {inspection_no: this._encriptDecript.encrypt(this.dataSource?.data[0]?.inspection_no)}])
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

      var createinspection3 : Array<Updateinspection3model> = [];

      for(let i=0;i<this.dataSource.data.length;i++){

        if(this.dataSource.data[i].date_of_inspection == null
          || this.dataSource.data[i].date_of_inspection == ''){
          this._toster.info('Please Fill Date Of Inspection of Production Lot No '
            +this.dataSource.data[i].production_lot_no, 'Info');
          return;
        }

        let net_area : number = this.dataSource.data[i].net_area_as_per_insp2 - this.dataSource.data[i].not_cross_area;

        var json = {
          line_no : this.dataSource.data[i].line_no,
          date_of_inspection : this.datePipe.transform(this.dataSource.data[i].date_of_inspection,'MM/dd/yyyy'),
          crop_condition : this.dataSource.data[i].crop_condition,
          crop_stage : this.dataSource.data[i].crop_stage,
          not_cross_area : this.dataSource.data[i].not_cross_area,
          net_cross_area : net_area,
          crossing_start_date : this.datePipe.transform(this.dataSource.data[i].crossing_start_date,'MM/dd/yyyy'),
          avg_crossing_per_day : this.dataSource.data[i].avg_crossing_per_day,
          self_boll_per_plant : this.dataSource.data[i].self_boll_per_plant,
          crossing_end_date : this.datePipe.transform(this.dataSource.data[i].crossing_end_date,'MM/dd/yyyy'),
          kapas_picking_if_any : this.dataSource.data[i].kapas_picking_if_any,
          name_of_fertilizer : this.dataSource.data[i].name_of_fertilizer,
          fertilizer_date : this.datePipe.transform(this.dataSource.data[i].fertilizer_date,'MM/dd/yyyy'),
          fertilizer_dose : this.dataSource.data[i].fertilizer_dose,
          sprying_fungi_or_insecticide_date : this.datePipe.transform(this.dataSource.data[i].sprying_fungi_or_insecticide_date,'MM/dd/yyyy'),
          name_of_insecticide_or_fungicide : this.dataSource.data[i].name_of_insecticide_or_fungicide,
          sprying_fungi_or_insecticide_dose : this.dataSource.data[i].sprying_fungi_or_insecticide_dose,
          other_specific_observations : this.dataSource.data[i].other_specific_observations,
          suggestion_to_grower : this.dataSource.data[i].suggestion_to_grower,
          durationofCrop : this.dataSource.data[i].durationofCrop,
        }
        createinspection3.push(json)
      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: null,
        lines: createinspection3
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_three_line, posted_json).then(
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_three+row_element.line_no).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.dataSource.data.splice(this.dataSource.data.indexOf(row_element), 1);
            this.dataSource = new MatTableDataSource<Createinspection3model>(this.dataSource.data);
            if(this.dataSource.data.length == 0){
              this.delete_header(this.brow_insp_no);
              this.brow_insp_no = null;
              this.dataSource.data = [];
              this.router.navigate(['/plantinginspection/createinspection3'])
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_three_header+inspection_no).then(
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

      var createinspection3 : Array<Updateinspection3model> = [];

      for(let i=0;i<this.dataSource.data.length;i++){

        if(this.dataSource.data[i].date_of_inspection == null
          || this.dataSource.data[i].date_of_inspection == ''){
          this._toster.info('Please Fill Date Of Inspection of Production Lot No '
            +this.dataSource.data[i].production_lot_no, 'Info');
          return;
        }

        let net_area : number = this.dataSource.data[i].net_area_as_per_insp2 - this.dataSource.data[i].not_cross_area;

        var json = {
          line_no : this.dataSource.data[i].line_no,
          date_of_inspection : this.datePipe.transform(this.dataSource.data[i].date_of_inspection,'MM/dd/yyyy'),
          crop_condition : this.dataSource.data[i].crop_condition,
          crop_stage : this.dataSource.data[i].crop_stage,
          not_cross_area : this.dataSource.data[i].not_cross_area,
          net_cross_area : net_area,
          crossing_start_date : this.datePipe.transform(this.dataSource.data[i].crossing_start_date,'MM/dd/yyyy'),
          avg_crossing_per_day : this.dataSource.data[i].avg_crossing_per_day,
          self_boll_per_plant : this.dataSource.data[i].self_boll_per_plant,
          crossing_end_date : this.datePipe.transform(this.dataSource.data[i].crossing_end_date,'MM/dd/yyyy'),
          kapas_picking_if_any : this.dataSource.data[i].kapas_picking_if_any,
          name_of_fertilizer : this.dataSource.data[i].name_of_fertilizer,
          fertilizer_date : this.datePipe.transform(this.dataSource.data[i].fertilizer_date,'MM/dd/yyyy'),
          fertilizer_dose : this.dataSource.data[i].fertilizer_dose,
          sprying_fungi_or_insecticide_date : this.datePipe.transform(this.dataSource.data[i].sprying_fungi_or_insecticide_date,'MM/dd/yyyy'),
          name_of_insecticide_or_fungicide : this.dataSource.data[i].name_of_insecticide_or_fungicide,
          sprying_fungi_or_insecticide_dose : this.dataSource.data[i].sprying_fungi_or_insecticide_dose,
          other_specific_observations : this.dataSource.data[i].other_specific_observations,
          suggestion_to_grower : this.dataSource.data[i].suggestion_to_grower,
          durationofCrop : this.dataSource.data[i].durationofCrop,
        }
        createinspection3.push(json)
      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: this.sessionManageMent.getEmail,
        lines: createinspection3
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_three_line, posted_json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.router.navigate(['/plantinginspection/inspectionthreelist'])
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
