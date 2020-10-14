import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {categorymodel} from '../../../admin/itemmanagement/itemlist/itemcreation/itemcreationmodel';
import {BincodeLocation, SeasonMastermodel} from '../../../processtransfer/processtransfercreate/processtransfercreatemodel';
import {CropStagemodel} from '../../../admin/itemmanagement/itemcategory/itemcategorymodel';
import {ItemList} from '../../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {LocationList} from '../../../inbound/gateentry/creategateentry/creategateentry';
import {fsio_no_model, get_fsio_grower_details, get_fsio_no, Plantingviewmodel, production_generate} from './plantingviewmodel';
import {Gowermasterlistmodel} from '../../../admin/growermaster/growermasterlist/gowermasterlistmodel';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-plantingview',
  templateUrl: './plantingview.component.html',
  styleUrls: ['./plantingview.component.scss']
})
export class PlantingviewComponent implements OnInit {

  adjustmentdata: Array<Plantingviewmodel> = [];
  inputjson: any;

  dataSource: MatTableDataSource<get_fsio_grower_details>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['select','fsio_no','grower_no', 'grower_name','item_no','item_name',
    'category','item_class_of_seed','item_crop_type', 'item_uom', 'sowing_date', 'sowing_area_in_r',
    'production_lot_no','revised_yield','inspection_1','inspection_2','inspection_3',
    'inspection_4','inspection_qc','Action'];
  adjustment_work: FormGroup;
  ItemCategoryList: Array<categorymodel> = []
  seasonMaster: Array<SeasonMastermodel> = [];
  get_crop_stage_master: CropStagemodel[];
  searchByItemNameorNo: string = '';
  itemlist: ItemList[];
  CropId: number = null;
  searchByGrowerNameorNo: string = '';
  grower_code: Gowermasterlistmodel[];
  locationlist: Array<{location_id:string;location_name:string}>;
  searchBylocation: string;
  category: string;
  searchByFsioNo : string = '';
  fsioNoModel: fsio_no_model[];
  mat_select_fsio = new FormControl();
  mat_select_stage = new FormControl();
  fsio_no: Array<get_fsio_no> = []
  total_sowing_area_in_r : number = 0;
  total_land_in_r : number = 0;
  minDateexp: any;
  grower_name : string = '';
  selectAll:boolean=false;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private datePipe: DatePipe) {

    this.adjustment_work = _formBuilder.group({
      get_plant_fsio : ['', Validators.required],
      GrowerCode: ['', Validators.required],
      ItemCode: ['', Validators.required],
      item_group : ['', Validators.required],
      base_uom : ['', Validators.required],
      class_of_seed : ['', Validators.required],
      item_crop_type : ['', Validators.required],
      SowingDate : [null, Validators.required],
      SowingArea: [0],
    });
    this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('res')));
  }

  ngOnInit(): void {
    this.document_info();
    this.get_grower();
  }

  // getLandInR(){
  //   try{
  //     let sum=0;
  //     for(let i=0;i<this.fsio_no.length;i++){
  //       for(let j=0;j<this.mat_select_fsio.value.length;j++){
  //         if(this.fsio_no[i].document_no===this.mat_select_fsio.value[j]){
  //           sum+=this.fsio_no[i].land_in_r;
  //         }
  //       }
  //     }
  //     return sum;
  //   }catch (e) {
  //     return 0;
  //   }
  // }
  //
  // selectedFSIONO(){
  //   try{
  //     let sel_fsio='';let category = '';
  //
  //     for(let i=0;i<this.fsio_no.length;i++){
  //       for(let j=0;j<this.mat_select_fsio.value.length;j++){
  //         if(this.fsio_no[i].document_no===this.mat_select_fsio.value[j]){
  //           if(sel_fsio == ''){
  //             sel_fsio+=this.fsio_no[i].document_no;
  //             category = this.fsio_no[i].category;
  //           }else{
  //             sel_fsio+=';'+this.fsio_no[i].document_no;
  //           }
  //         }
  //       }
  //     }
  //     return sel_fsio;
  //   }catch (e) {
  //     return '';
  //   }
  // }

  set_fsio(){
    try {
      if(this.mat_select_fsio.value == null || this.mat_select_fsio.value == '' ){
        this._toster.info('Please Select At Least One FSIO No', 'Info');
        return;
      }
      if(this.mat_select_stage.value == null){
        this._toster.info('Please Select Stage', 'Info');
        return;
      }
      this.spinner.show();

      var fsio_json : Array<fsio_no_model> = [];

      for(let i=0;i<this.fsio_no.length;i++){
        for(let j=0;j<this.mat_select_fsio.value.length;j++){
          if(this.fsio_no[i].document_no===this.mat_select_fsio.value[j]){
            var json = {
              fsio_no : this.fsio_no[i].document_no
            }
            fsio_json.push(json)
          }
        }
      }

      const posted_json = {
        planting_no: this.adjustmentdata[0]?.planting_no,
        category: this.category,
        stage: this.mat_select_stage.value,
        lines: fsio_json
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PlantingFSIOCreate, posted_json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.spinner.hide();
            this.document_info();
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

  clear_fsio(){

    try {
      this.spinner.show();
      const json = {
        planting_no: this.adjustmentdata[0]?.planting_no
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PlantingFSIODelete, json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.spinner.hide();
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

  bind_crop_stage(fsio_no : any){
    this.category = fsio_no.category;
    this.get_Crop_Stage_Master(this.category);
  }

  get_Crop_Stage_Master(crop) {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CropStageMasterWithCategory+crop).then(result => {
        if (result[0].hasOwnProperty('stage')) {
          this.get_crop_stage_master = result as CropStagemodel[];
          if(this.adjustmentdata[0].stage != null){
            this.mat_select_stage.setValue(this.adjustmentdata[0].stage);
            this.mat_select_stage.disable();
          }
        } else {
          this._toster.error('Crop Stage Master Not Found', 'Error');
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

  bind_planting_fsio_grower() {
    try {
      this.spinner.show();

      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_fsio_grower_with_planting_no+this.adjustmentdata[0]?.planting_no).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.dataSource = new MatTableDataSource<get_fsio_grower_details>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            // this._toster.info(result[0].message, 'Info');
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

  get_grower(){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.find_grower +this.searchByGrowerNameorNo).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.grower_code = result as Gowermasterlistmodel[];
        } else {
          this.grower_code = [];
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

  set_grower_name(growercode : any){
    this.grower_name = growercode.name;
  }

  document_info() {
    try {
      this.spinner.show();

      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_planting_info+this.inputjson.planting_no).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.adjustmentdata = result;
            if(this.adjustmentdata[0].fsio_no != null){
              this.category = this.adjustmentdata[0].category;
              this.mat_select_fsio.setValue(this.adjustmentdata[0].fsio_no.split(';'));
              this.get_Crop_Stage_Master(this.adjustmentdata[0].category);
              this.bind_planting_fsio_grower();
            }
            this.get_fsio_organiser_code();
            this.get_planting_fsio();
            this.get_fsio_item();
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

  get_fsio_organiser_code(){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_fsio_no_with_organiser_code+
        this.adjustmentdata[0]?.organiser_code+'&location_id='+this.adjustmentdata[0]?.location_id).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.fsio_no = result;
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

  get_planting_fsio(){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.find_fsio_no_with_planting_no +
        this.adjustmentdata[0]?.planting_no + '&fsio_no=' + this.searchByFsioNo).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.fsioNoModel = result as fsio_no_model[];
        } else {
          this.fsioNoModel = [];
          // this._toster.error(result[0].message, 'Error');
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

  get_fsio_item(){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.find_item_no_with_cat_cos_tl +
        this.adjustmentdata[0]?.category + '&no_or_name=' + this.searchByItemNameorNo).then(result => {
        if (result[0].condition.toLowerCase() === 'true') {
          this.itemlist = result as ItemList[];
        } else {
          this.itemlist = [];
          // this._toster.error(result[0].message, 'Error');
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

  set_group_uom(item_list : any){
    this.adjustment_work.get('item_group').setValue(item_list.item_group);
    this.adjustment_work.get('base_uom').setValue(item_list.baseuom);
    this.adjustment_work.get('class_of_seed').setValue(item_list.class_of_seed);
    this.adjustment_work.get('item_crop_type').setValue(item_list.item_crop_type);
  }

  checkSelect(event){
    try{
      for(let i=0;i<this.dataSource.data.length;i++){
        if(event.checked){
          this.dataSource.data[i].check_production = 1;
        }else{
          this.dataSource.data[i].check_production = 0;
        }
      }
    }catch (e) {
    }
  }

  checkPeticulerchckbox(event){
    let check=false;
    try{
      for(let i=0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].check_production == undefined ||
          this.dataSource.data[i].check_production == null ||
          this.dataSource.data[i].check_production == 0)
        {
          check=true;
          break;
        }
      }
      if(check){
        this.selectAll=false;
      }else{
        this.selectAll=true;
      }
    }catch (e) {
    }
  }

  generate_production_lot_no(){
    try{

      var prod_gen_json : Array<production_generate> = [];

      for(let i=0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].check_production == 1 && this.dataSource.data[i].production_lot_no == null)
        {
          var json = {
            planting_line_id : this.dataSource.data[i].planting_line_id,
            line_id : this.dataSource.data[i].line_id
          }
          prod_gen_json.push(json)
        }
      }

      if(prod_gen_json.length<=0){
        this._toster.info('Please select at least one line for generation of production lot no', 'Info');
        return;
      }

      const posted_json = {
        planting_no: this.adjustmentdata[0]?.planting_no,
        lines: prod_gen_json
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.planting_fsio_grower_production_generate, posted_json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.spinner.hide();
            this.selectAll = false;
            this.bind_planting_fsio_grower();
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

  complete_planting() {
    try {
      if(this.dataSource.data.length <= 0){
        this._toster.info('Please Add Grower For Submittion of Planting', 'Info');
        return;
      }

      for(let i = 0;i<this.dataSource.data.length; i++){
        if(this.dataSource.data[i].category.toLowerCase() == 'cotton'){
          if(this.dataSource.data[i].inspection_1 == 0 || this.dataSource.data[i].inspection_2 == 0 ||
            this.dataSource.data[i].inspection_3 == 0 || this.dataSource.data[i].inspection_4 == 0 ||
            this.dataSource.data[i].inspection_qc == 0){
            this._toster.info('In Case Of Category Cotton All Inspection Must Be Completed Before Submitting the Planting Document.', 'Info');
            return;
          }
        }else if(this.dataSource.data[i].category.toLowerCase() == 'vegetable') {
          if (this.dataSource.data[i].item_crop_type == 'hybrid') {
            if (this.dataSource.data[i].inspection_1 == 0 || this.dataSource.data[i].inspection_2 == 0 ||
              this.dataSource.data[i].inspection_3 == 0 || this.dataSource.data[i].inspection_4 == 0 ||
              this.dataSource.data[i].inspection_qc == 0) {
              this._toster.info('In Case Of Category Vegetable and Item Crop Type Hybrid All Inspection Must Be Completed Before Submitting the Planting Document.', 'Info');
              return;
            }
          }else if(this.dataSource.data[i].item_crop_type == 'improved'){
            if (this.dataSource.data[i].inspection_1 == 0 || this.dataSource.data[i].inspection_4 == 0 ||
              this.dataSource.data[i].inspection_qc == 0) {
              this._toster.info('In Case Of Category Vegetable and Item Crop Type Improved Inspection (1, 4, QC) Must Be Completed Before Submitting the Planting Document.', 'Info');
              return;
            }
          }
        }else if(this.dataSource.data[i].category.toLowerCase() == 'field crop') {
          if (this.dataSource.data[i].item_crop_type == 'hybrid') {
            if (this.dataSource.data[i].inspection_1 == 0 || this.dataSource.data[i].inspection_2 == 0 ||
              this.dataSource.data[i].inspection_3 == 0 || this.dataSource.data[i].inspection_4 == 0 ||
              this.dataSource.data[i].inspection_qc == 0) {
              this._toster.info('In Case Of Category Field Crop and Item Crop Type Hybrid All Inspection Must Be Completed Before Submitting the Planting Document.', 'Info');
              return;
            }
          }else if(this.dataSource.data[i].item_crop_type == 'improved'){
            if (this.dataSource.data[i].inspection_1 == 0 || this.dataSource.data[i].inspection_4 == 0 ||
              this.dataSource.data[i].inspection_qc == 0) {
              this._toster.info('In Case Of Category Field Crop and Item Crop Type Improved Inspection (1, 4, QC) Must Be Completed Before Submitting the Planting Document.', 'Info');
              return;
            }
          }
        }
      }

      this.spinner.show();
      const json = {
        planting_no : this.adjustmentdata[0]?.planting_no,
        created_by: this.sessionManageMent.getEmail
      };
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PlantingCompleted, json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.spinner.hide();
            this.router.navigateByUrl('/plantinginspection/plantinglist');
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

  add_grower() {
    try {

      if(this.adjustment_work.get('SowingArea').value <= 0){
        this._toster.info('Sowing Area Cannot be Less Than Or Equal To Zero' , 'Info');
        return;
      }

      this.spinner.show();
      const json = {
        planting_no: this.adjustmentdata[0].planting_no,
        fsio_no: this.adjustment_work.get('get_plant_fsio').value,
        grower_no: this.adjustment_work.get('GrowerCode').value,
        grower_name: this.grower_name,
        item_no: this.adjustment_work.get('ItemCode').value,
        item_group: this.adjustment_work.get('item_group').value,
        sowing_date: this.datePipe.transform(this.adjustment_work.get('SowingDate').value,'MM-dd-yyyy'),
        sowing_area_in_r: this.adjustment_work.get('SowingArea').value,
        created_by : this.sessionManageMent.getEmail,
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PlantingFSIOGrower, json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {

            this.selectAll = false;

            this.adjustment_work.get('SowingArea').setValue(0);
            this.adjustment_work.get('SowingDate').setValue(null);
            this.adjustment_work.get('base_uom').setValue('');
            this.adjustment_work.get('item_group').setValue('');
            this.adjustment_work.get('ItemCode').setValue('');
            this.adjustment_work.get('class_of_seed').setValue('');
            this.adjustment_work.get('item_crop_type').setValue('');
            this.adjustment_work.get('GrowerCode').setValue('');
            this.adjustment_work.get('get_plant_fsio').setValue('');

            this.bind_planting_fsio_grower();

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

  delete_line_barcode(row_element : any){
    try {
      if(row_element.line_id == '' || row_element.line_id ==  null){
        this._toster.info('No Record For Deletion', 'Info');
        return;
      }
      this.spinner.show();
      const json = {
        planting_no: this.adjustmentdata[0]?.planting_no,
        planting_line_id : row_element.planting_line_id,
        line_id : row_element.line_id
      };
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.PlantingFSIOGrowerDelete, json).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.dataSource.data = [];
            this.bind_planting_fsio_grower();
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

}
