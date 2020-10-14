import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {Itemcategorymodel} from '../../../../admin/itemmanagement/itemcategory/itemcategorymodel';
import {MatTableDataSource} from '@angular/material/table';
import {
  Createinspection1model,
  Updateinspection1model
} from '../../inspectionlist/inspectioncreate/createinspection1/createinspection1model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {Createinspection2model, Updateinspection2model} from './createinspection2model';

@Component({
  selector: 'app-createinspection2',
  templateUrl: './createinspection2.component.html',
  styleUrls: ['./createinspection2.component.scss']
})
export class Createinspection2Component implements OnInit {


  scan_production_lot_no = new FormControl();
  // inspection_form: FormGroup;
  scan_prod : boolean = true;
  brow_insp_no : string = '';
  minDateexp : any = '';
  crop_condition : string[] = ['Bad','Medium','Good'];
  crop_stage : string[] = ['Germination','Vegetative'];


  dataSource: MatTableDataSource<Createinspection2model>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['production_lot_no','grower_no', 'grower_name','item_no','item_name',
    'category','sub_category','item_class_of_seeds','item_crop_type', 'date_of_inspection',
    'net_area_as_per_insp1', 'pld_area','rejected_area','net_area','crossing_start_date',
    'avg_crossing_per_day','avg_cross_boll_per_plant','self_boll_per_plant','off_type_plant',
    'crop_condition','crop_stage','suggestion_to_grower','spacing_female_row','spacing_female_plant',
    'spacing_variety_row','spacing_variety_plant','spacing_male_row','spacing_male_plant','Action'];

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

  get_net_area(row_element : any){
    try {
      let net_area : number = row_element.net_area_as_per_insp1 - (row_element.pld_area + row_element.rejected_area);
      if(net_area < 0){
        return 0;
      }else{
        return net_area;
      }
    }catch (e) {
      return 0;
    }
  }

  setpldarea(row_element : any){
    try{
      if(row_element.pld_area < 0){
        this._toster.info('Pld Area (' + row_element.pld_area +
          ') can not be less than Zero of production lot no ' + row_element.production_lot_no, 'Info');
        row_element.pld_area = 0;
        return;
      }
      if((row_element.pld_area + row_element.rejected_area) > row_element.net_area_as_per_insp1){
        this._toster.info('Pld Area (' + row_element.pld_area +
          ') can not be greater than Inspection 1 Net Area (' +row_element.net_area_as_per_insp1+
          ') of production lot no ' + row_element.production_lot_no, 'Info');
        row_element.pld_area = 0;
      }
    }catch (e) {
      return 0;
    }
  }

  setrejectedarea(row_element : any){
    try{
      if(row_element.rejected_area < 0){
        this._toster.info('Rejected Area (' + row_element.rejected_area +
          ') can not be less than Zero of production lot no ' + row_element.production_lot_no, 'Info');
        row_element.rejected_area = 0;
        return;
      }
      if((row_element.rejected_area + row_element.pld_area)  > row_element.net_area_as_per_insp1){
        this._toster.info('Rejected Area (' + row_element.rejected_area +
          ') can not be greater than Inspection 1 Net Area (' +row_element.net_area_as_per_insp1+
          ') of production lot no ' + row_element.production_lot_no, 'Info');
        row_element.rejected_area = 0;
      }
    }catch (e) {
      return 0;
    }
  }

  get_inspection_details(inspection_no) {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_inspection_two_info+inspection_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Createinspection2model>(result);
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
        flag : 'INSP2'
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.scanProductionLotNo,json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.scan_production_lot_no.setValue('')
            this.dataSource = new MatTableDataSource<Createinspection2model>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.brow_insp_no = this.dataSource?.data[0]?.inspection_no;
            this.router.navigate(['/plantinginspection/createinspection2', {inspection_no: this._encriptDecript.encrypt(this.dataSource?.data[0]?.inspection_no)}])
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

      var createinspection2 : Array<Updateinspection2model> = [];

      for(let i=0;i<this.dataSource.data.length;i++){

        // if(this.dataSource.data[i].rejected_area > this.dataSource.data[i].pld_area){
        //   this._toster.info('Rejection Area ('+this.dataSource.data[i].rejected_area+') can not be greater than Area (' +
        //     this.dataSource.data[i].pld_area+') of Production Lot No ('+this.dataSource.data[i].production_lot_no+') ', 'Info');
        //   return;
        // }

        // if((this.dataSource.data[i].rejected_area + this.dataSource.data[i].pld_area) > this.dataSource.data[i].net_area_as_per_insp1){
        //   this._toster.info('Rejection Area ('+this.dataSource.data[i].rejected_area+') and Pld Area ('+this.dataSource.data[i].pld_area+') ' +
        //     'can not be greater than Inspection 1 Net Area (' + this.dataSource.data[i].net_area_as_per_insp1+') of Production Lot No ('+this.dataSource.data[i].production_lot_no+') ', 'Info');
        //   return;
        // }

        if(this.dataSource.data[i].date_of_inspection == null
          || this.dataSource.data[i].date_of_inspection == ''){
          this._toster.info('Please Fill Date Of Inspection of Production Lot No '
            +this.dataSource.data[i].production_lot_no, 'Info');
          return;
        }


        let net_area : number = this.dataSource.data[i].net_area_as_per_insp1 -
          (this.dataSource.data[i].rejected_area + this.dataSource.data[i].pld_area);

        // if(net_area > this.dataSource.data[i].pld_area){
        //   this._toster.info('Net Area ('+net_area+') can not be greater than Area (' +
        //     this.dataSource.data[i].pld_area+') of Production Lot No ('+this.dataSource.data[i].production_lot_no+') ', 'Info');
        //   return;
        // }
        //
        // if(net_area < 0){
        //   this._toster.info('Net Area ('+net_area+') must be greater than zero of Production Lot No ('+this.dataSource.data[i].production_lot_no+') ', 'Info');
        //   return;
        // }

        var json = {
          line_no : this.dataSource.data[i].line_no,
          date_of_inspection : this.datePipe.transform(this.dataSource.data[i].date_of_inspection,'MM/dd/yyyy'),
          pld_area : this.dataSource.data[i].pld_area,
          rejected_area : this.dataSource.data[i].rejected_area,
          net_area : net_area,
          crossing_start_date : this.datePipe.transform(this.dataSource.data[i].crossing_start_date,'MM/dd/yyyy'),
          avg_crossing_per_day : this.dataSource.data[i].avg_crossing_per_day,
          avg_cross_boll_per_plant : this.dataSource.data[i].avg_cross_boll_per_plant,
          self_boll_per_plant : this.dataSource.data[i].self_boll_per_plant,
          off_type_plant : this.dataSource.data[i].off_type_plant,
          crop_condition : this.dataSource.data[i].crop_condition,
          crop_stage : this.dataSource.data[i].crop_stage,
          suggestion_to_grower : this.dataSource.data[i].suggestion_to_grower,
          spacing_female_row : this.dataSource.data[i].spacing_female_row,
          spacing_female_plant : this.dataSource.data[i].spacing_female_plant,
          spacing_variety_row : this.dataSource.data[i].spacing_variety_row,
          spacing_variety_plant : this.dataSource.data[i].spacing_variety_plant,
          spacing_male_row : this.dataSource.data[i].spacing_male_row,
          spacing_male_plant : this.dataSource.data[i].spacing_male_plant,
        }
        createinspection2.push(json)
      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: null,
        lines: createinspection2
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_two_line, posted_json).then(
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_two+row_element.line_no).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.dataSource.data.splice(this.dataSource.data.indexOf(row_element), 1);
            this.dataSource = new MatTableDataSource<Createinspection2model>(this.dataSource.data);
            if(this.dataSource.data.length == 0){
              this.delete_header(this.brow_insp_no);
              this.brow_insp_no = null;
              this.dataSource.data = [];
              this.router.navigate(['/plantinginspection/createinspection2'])
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_two_header+inspection_no).then(
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

      var createinspection2 : Array<Updateinspection2model> = [];

      for(let i=0;i<this.dataSource.data.length;i++){

        if(this.dataSource.data[i].date_of_inspection == null
          || this.dataSource.data[i].date_of_inspection == ''){
          this._toster.info('Please Fill Date Of Inspection of Production Lot No '
            +this.dataSource.data[i].production_lot_no, 'Info');
          return;
        }

        // if(this.dataSource.data[i].rejected_area > this.dataSource.data[i].net_area_as_per_insp1){
        //   this._toster.info('Rejection Area ('+this.dataSource.data[i].rejected_area+') can not be greater than Area (' +
        //     this.dataSource.data[i].net_area_as_per_insp1+') of Production Lot No ('+this.dataSource.data[i].production_lot_no+') ', 'Info');
        //   return;
        // }

        let net_area : number = this.dataSource.data[i].net_area_as_per_insp1 -
          (this.dataSource.data[i].rejected_area + this.dataSource.data[i].pld_area);

        // if(net_area > this.dataSource.data[i].pld_area){
        //   this._toster.info('Net Area ('+net_area+') can not be greater than Area (' +
        //     this.dataSource.data[i].pld_area+') of Production Lot No ('+this.dataSource.data[i].production_lot_no+') ', 'Info');
        //   return;
        // }

        var json = {
          line_no : this.dataSource.data[i].line_no,
          date_of_inspection : this.datePipe.transform(this.dataSource.data[i].date_of_inspection,'MM/dd/yyyy'),
          pld_area : this.dataSource.data[i].pld_area,
          rejected_area : this.dataSource.data[i].rejected_area,
          net_area : net_area,
          crossing_start_date : this.datePipe.transform(this.dataSource.data[i].crossing_start_date,'MM/dd/yyyy'),
          avg_crossing_per_day : this.dataSource.data[i].avg_crossing_per_day,
          avg_cross_boll_per_plant : this.dataSource.data[i].avg_cross_boll_per_plant,
          self_boll_per_plant : this.dataSource.data[i].self_boll_per_plant,
          off_type_plant : this.dataSource.data[i].off_type_plant,
          crop_condition : this.dataSource.data[i].crop_condition,
          crop_stage : this.dataSource.data[i].crop_stage,
          suggestion_to_grower : this.dataSource.data[i].suggestion_to_grower,
          spacing_female_row : this.dataSource.data[i].spacing_female_row,
          spacing_female_plant : this.dataSource.data[i].spacing_female_plant,
          spacing_variety_row : this.dataSource.data[i].spacing_variety_row,
          spacing_variety_plant : this.dataSource.data[i].spacing_variety_plant,
          spacing_male_row : this.dataSource.data[i].spacing_male_row,
          spacing_male_plant : this.dataSource.data[i].spacing_male_plant,

        }
        createinspection2.push(json)
      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: this.sessionManageMent.getEmail,
        lines: createinspection2
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_two_line, posted_json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.router.navigate(['/plantinginspection/inspectiontwolist'])
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
