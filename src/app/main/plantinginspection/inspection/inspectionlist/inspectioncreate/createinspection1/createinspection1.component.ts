import {Component, OnInit, ViewChild} from '@angular/core';
import {fsio_no_model, get_fsio_no, Plantingviewmodel, production_generate} from '../../../../planting/plantingview/plantingviewmodel';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {categorymodel} from '../../../../../admin/itemmanagement/itemlist/itemcreation/itemcreationmodel';
import {SeasonMastermodel} from '../../../../../processtransfer/processtransfercreate/processtransfercreatemodel';
import {CropStagemodel, Itemcategorymodel} from '../../../../../admin/itemmanagement/itemcategory/itemcategorymodel';
import {ItemList} from '../../../../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel';
import {Gowermasterlistmodel} from '../../../../../admin/growermaster/growermasterlist/gowermasterlistmodel';
import {SessionManageMent} from '../../../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {Inspectioncreatemodel} from '../inspectioncreatemodel';
import {Createinspection1model, Updateinspection1model} from './createinspection1model';
import {GateEntryLines} from '../../../../../inbound/gateentry/creategateentry/creategateentry';

@Component({
  selector: 'app-createinspection1',
  templateUrl: './createinspection1.component.html',
  styleUrls: ['./createinspection1.component.scss']
})
export class Createinspection1Component implements OnInit {

  scan_production_lot_no = new FormControl();
  // inspection_form: FormGroup;
  scan_prod : boolean = true;
  brow_insp_no : string = '';
  minDateexp : any = '';
  isolation_distance : string[] = ['Maintained','Non-Maintained'];
  get_crop: Itemcategorymodel[];
  germination_status : string[] = ['Satisfactory','Non-Satisfactory'];
  crop_condition : string[] = ['Bad','Medium','Good'];
  crop_stage : string[] = ['Germination','Vegetative'];
  pervious_crop : string[] = ['Bajra','Cluster Beans','cotton','Cowpea','Maize','Mustard','paddy','Wheat']


  dataSource: MatTableDataSource<Createinspection1model>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['production_lot_no','grower_no', 'grower_name','item_no','item_name',
    'category','sub_category','item_class_of_seeds','item_crop_type', 'date_of_inspection',
    'isolation_distance_status', 'isolation_distance_in_metre','previous_crop','germination_status',
    'germination_per','area','rejection_area','net_area','spacing_variety','spacing_male','spacing_female',
    'plant_population_variety','plant_population_male','plant_population_female','crop_condition','crop_stage',
    'suggestion_to_grower','spacing_female_row','spacing_female_plant','spacing_variety_row','spacing_variety_plant',
    'spacing_male_row','spacing_male_plant','Action'];

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

  setDistanceMeter(row_element : any){
    if(row_element.isolation_distance_status == 'Maintained'){
      row_element.isolation_distance_in_metre = 0;
    }
  }

  setGerminationPer(row_element : any){
    if(row_element.germination_status == 'Satisfactory'){
      row_element.germination_per = 0;
    }
  }

  setRejectionArea(row_element : any){
    try{
      if(row_element.rejection_area < 0){
        this._toster.info('Rejection Area (' + row_element.rejection_area +
          ') can not be less than Zero of production lot no ' + row_element.production_lot_no, 'Info');
        row_element.rejection_area = 0;
        return;
      }
      if(row_element.rejection_area > row_element.area){
        this._toster.info('Rejection Area (' + row_element.rejection_area +
          ') can not be greater than Area (' +row_element.area+
          ') of production lot no ' + row_element.production_lot_no, 'Info');
        row_element.rejection_area = 0;
      }
    }catch (e) {
      return 0;
    }
  }

  get_net_area(row_element : any){
    try {
      let net_area : number = row_element.area - row_element.rejection_area;
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_inspection_one_info+inspection_no).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<Createinspection1model>(result);
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
        flag : 'INSP1'
      }

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.scanProductionLotNo,json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.scan_production_lot_no.setValue('')
            this.dataSource = new MatTableDataSource<Createinspection1model>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.brow_insp_no = this.dataSource?.data[0]?.inspection_no;
            this.router.navigate(['/plantinginspection/createinspection1', {inspection_no: this._encriptDecript.encrypt(this.dataSource?.data[0]?.inspection_no)}])
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

      var createinspection1 : Array<Updateinspection1model> = [];

      for(let i=0;i<this.dataSource.data.length;i++){

          if(this.dataSource.data[i].date_of_inspection == null
            || this.dataSource.data[i].date_of_inspection == ''){
            this._toster.info('Please Fill Date Of Inspection of Production Lot No '
              +this.dataSource.data[i].production_lot_no, 'Info');
            return;
          }

          let net_area : number = this.dataSource.data[i].area - this.dataSource.data[i].rejection_area;

          var json = {
            line_no : this.dataSource.data[i].line_no,
            date_of_inspection : this.datePipe.transform(this.dataSource.data[i].date_of_inspection,'MM/dd/yyyy'),
            isolation_distance_status : this.dataSource.data[i].isolation_distance_status,
            isolation_distance_in_metre : this.dataSource.data[i].isolation_distance_in_metre,
            previous_crop : this.dataSource.data[i].previous_crop,
            germination_status : this.dataSource.data[i].germination_status,
            germination_per : this.dataSource.data[i].germination_per,
            rejection_area : this.dataSource.data[i].rejection_area,
            net_area : net_area,
            spacing_variety : this.dataSource.data[i].spacing_variety,
            spacing_male : this.dataSource.data[i].spacing_male,
            spacing_female : this.dataSource.data[i].spacing_female,
            plant_population_variety : this.dataSource.data[i].plant_population_variety,
            plant_population_male : this.dataSource.data[i].plant_population_male,
            plant_population_female : this.dataSource.data[i].plant_population_female,
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
          createinspection1.push(json)
      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: null,
        lines: createinspection1
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_one_line, posted_json).then(
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_one+row_element.line_no).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.dataSource.data.splice(this.dataSource.data.indexOf(row_element), 1);
            this.dataSource = new MatTableDataSource<Createinspection1model>(this.dataSource.data);
            if(this.dataSource.data.length == 0){
              this.delete_header(this.brow_insp_no);
              this.brow_insp_no = null;
              this.dataSource.data = [];
              this.router.navigate(['/plantinginspection/createinspection1'])
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
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_inspection_one_header+inspection_no).then(
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

      var createinspection1 : Array<Updateinspection1model> = [];

      for(let i=0;i<this.dataSource.data.length;i++){

        if(this.dataSource.data[i].date_of_inspection == null
          || this.dataSource.data[i].date_of_inspection == ''){
          this._toster.info('Please Fill Date Of Inspection of Production Lot No '
            +this.dataSource.data[i].production_lot_no, 'Info');
          return;
        }

        // if(this.dataSource.data[i].isolation_distance_status == null
        //   || this.dataSource.data[i].isolation_distance_status == ''){
        //   this._toster.info('Please Fill Isolation Distance Status of Production Lot No '
        //     +this.dataSource.data[i].production_lot_no, 'Info');
        //   return;
        // }
        //
        // if(this.dataSource.data[i].isolation_distance_status == 'Non-Maintained'
        //   && this.dataSource.data[i].isolation_distance_in_metre <= 0){
        //   this._toster.info('Isolation Distance In Meter must be greater than zero of Production Lot No '
        //     +this.dataSource.data[i].production_lot_no, 'Info');
        //   return;
        // }
        //
        // if(this.dataSource.data[i].previous_crop == null
        //   || this.dataSource.data[i].previous_crop == ''){
        //   this._toster.info('Please Fill Previous Crop of Production Lot No '
        //     +this.dataSource.data[i].production_lot_no, 'Info');
        //   return;
        // }
        //
        // if(this.dataSource.data[i].germination_status == null
        //   || this.dataSource.data[i].germination_status == ''){
        //   this._toster.info('Please Fill Germination Status of Production Lot No '
        //     +this.dataSource.data[i].production_lot_no, 'Info');
        //   return;
        // }
        //
        // if(this.dataSource.data[i].germination_per == 'Non-Satisfactory'
        //   && this.dataSource.data[i].isolation_distance_in_metre <= 0){
        //   this._toster.info('Germination Percentage must be greater than zero of Production Lot No '
        //     +this.dataSource.data[i].production_lot_no, 'Info');
        //   return;
        // }

        // if(this.dataSource.data[i].rejection_area > this.dataSource.data[i].area){
        //   this._toster.info('Rejection Area ('+this.dataSource.data[i].rejection_area+') can not be greater than Area (' +
        //     this.dataSource.data[i].area+') of Production Lot No ('+this.dataSource.data[i].production_lot_no+') ', 'Info');
        //   return;
        // }

        let net_area : number = this.dataSource.data[i].area - this.dataSource.data[i].rejection_area;

        // if(net_area > this.dataSource.data[i].area){
        //   this._toster.info('Net Area ('+net_area+') can not be greater than Area (' +
        //     this.dataSource.data[i].area+') of Production Lot No ('+this.dataSource.data[i].production_lot_no+') ', 'Info');
        //   return;
        // }
        //
        // if(net_area <= 0){
        //   this._toster.info('Net Area ('+net_area+') must be greater than zero of Production Lot No ('+this.dataSource.data[i].production_lot_no+') ', 'Info');
        //   return;
        // }

        // if(this.dataSource.data[i].item_crop_type.toLowerCase() == 'improved'){
        //
        //   if(this.dataSource.data[i].spacing_variety <= 0){
        //     this._toster.info('Spacing Variety must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].plant_population_variety <= 0){
        //     this._toster.info('Plant Population Variety must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].spacing_variety_row <= 0){
        //     this._toster.info('Spacing Variety Row must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].spacing_variety_plant <= 0){
        //     this._toster.info('Spacing Variety Plant must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        // }else if(this.dataSource.data[i].item_crop_type.toLowerCase() == 'hybrid'){
        //
        //   if(this.dataSource.data[i].spacing_male <= 0){
        //     this._toster.info('Spacing Male must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].spacing_female <= 0){
        //     this._toster.info('Spacing Female must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].plant_population_male <= 0){
        //     this._toster.info('Plant Population Male must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].plant_population_female <= 0){
        //     this._toster.info('Plant Population Female must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].spacing_male_row <= 0){
        //     this._toster.info('Spacing Male Row must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].spacing_male_plant <= 0){
        //     this._toster.info('Spacing Male Plant must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].spacing_female_row <= 0){
        //     this._toster.info('Spacing Female Row must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        //   if(this.dataSource.data[i].spacing_female_plant <= 0){
        //     this._toster.info('Spacing Female Plant must be greater than zero of Production Lot No '
        //       +this.dataSource.data[i].production_lot_no, 'Info');
        //     return;
        //   }
        //
        // }

        var json = {
          line_no : this.dataSource.data[i].line_no,
          date_of_inspection : this.datePipe.transform(this.dataSource.data[i].date_of_inspection,'MM/dd/yyyy'),
          isolation_distance_status : this.dataSource.data[i].isolation_distance_status,
          isolation_distance_in_metre : this.dataSource.data[i].isolation_distance_in_metre,
          previous_crop : this.dataSource.data[i].previous_crop,
          germination_status : this.dataSource.data[i].germination_status,
          germination_per : this.dataSource.data[i].germination_per,
          rejection_area : this.dataSource.data[i].rejection_area,
          net_area : net_area,
          spacing_variety : this.dataSource.data[i].spacing_variety,
          spacing_male : this.dataSource.data[i].spacing_male,
          spacing_female : this.dataSource.data[i].spacing_female,
          plant_population_variety : this.dataSource.data[i].plant_population_variety,
          plant_population_male : this.dataSource.data[i].plant_population_male,
          plant_population_female : this.dataSource.data[i].plant_population_female,
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
        createinspection1.push(json)

      }

      const posted_json = {
        inspection_no: this.dataSource?.data[0]?.inspection_no,
        planting_no: this.dataSource?.data[0]?.planting_no,
        completed_by: this.sessionManageMent.getEmail,
        lines: createinspection1
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.update_inspection_one_line, posted_json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.router.navigate(['/plantinginspection/inspectionlist'])
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
