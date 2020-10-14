import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {categorymodel} from '../../../admin/itemmanagement/itemlist/itemcreation/itemcreationmodel';
import {
  BincodeLocation,
  ItemLotNoFromILEmodel,
  SeasonMastermodel
} from '../../../processtransfer/processtransfercreate/processtransfercreatemodel';
import {CropStagemodel} from '../../../admin/itemmanagement/itemcategory/itemcategorymodel';
import {ItemList} from '../../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel';
import {CustomerList} from '../../../outbound/deliveryorder/createdeliveryorder/createdeliveryordermodel';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {LocationList} from '../../../inbound/gateentry/creategateentry/creategateentry';
import {createreturnbsio, get_bsio_details_from_ile, get_document_no_from_ile} from '../../returnbsio/returnbsiocreate/returnbsiocreatemodel';

@Component({
  selector: 'app-returnhsiocreate',
  templateUrl: './returnhsiocreate.component.html',
  styleUrls: ['./returnhsiocreate.component.scss']
})
export class ReturnhsiocreateComponent implements OnInit {

  displayedColumns: string[] = [ 'item_no','item_name','fg_pack_size','main_category','sub_category',
    'lot_no','no_of_bags','quantity','returned_no_of_bags','returned_quantity',
    'return_no_of_bags','return_quantity'];
  dataSource: MatTableDataSource<get_bsio_details_from_ile> = null;

  @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
  @ViewChild("matSort", {static: true}) sort: MatSort;

  hsioReturnForm: FormGroup;
  ItemCategoryList: Array<categorymodel> = []
  seasonMaster: Array<SeasonMastermodel> = []
  bincodeLocations: Array<BincodeLocation> = [];
  get_crop_stage_master: CropStagemodel[]
  itemlist: ItemList[];
  itemlistonrow: ItemList[];
  set_item_no : string = '';
  set_item_name : string = '';
  packing_item_code : FormControl = new FormControl();
  searchByItemNameorNo: string = '';
  searchByItemLotNo: string = '';
  itemLotNo: Array<ItemLotNoFromILEmodel> = []
  CropId: number = null;
  start: boolean = false;
  currentdate: any = Date.now();
  get_bsio_details_from_ile : Array<get_bsio_details_from_ile> = [];
  locationlist: Array<{location_id:string;location_name:string}>;
  searchByCustomerNameorNo: string = '';
  customerlist: CustomerList[];
  get_document_no_from_ile: get_document_no_from_ile[];

  constructor(
    public sessionManageMent: SessionManageMent,
    private webApiHttp: WebApiHttp,
    private _formBuilder: FormBuilder,
    private _toster: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {
    this.hsioReturnForm = this._formBuilder.group({
      location: [null, Validators.required],
      CustomerNameorNo: [null, Validators.required],
      hsiono: [null, Validators.required],
    });

    this.dataSource = new MatTableDataSource<get_bsio_details_from_ile>(this.get_bsio_details_from_ile);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  ngOnInit(): void {
    this.get_location();
    this.get_CustomerNo();
  }

  get_location() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.locationlist).then(result => {
        this.locationlist = result as LocationList[];
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      }).finally(()=>{
        this.hsioReturnForm.get('location').setValue(parseInt(this.sessionManageMent.getLocationId));
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
  }

  get_CustomerNo() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.FindCustomer + this.searchByCustomerNameorNo).then(result => {
        this.customerlist = result as CustomerList[];
        if (result[0].condition.toLowerCase() != 'true') {
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

  get_bsio_no_from_ile(customer : any) {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_hsio_no_from_ile +
        this.sessionManageMent.getLocationName + '&customer_no=' + customer.customer_id).then(result => {
        this.get_document_no_from_ile = result as get_document_no_from_ile[];
        if (result[0].condition.toLowerCase() != 'true') {
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

  get_order(){

    if(this.hsioReturnForm.get('location').value == null
      || this.hsioReturnForm.get('location').value == ''){
      this._toster.warning('Please Select Location', 'Warning');
      return;
    }

    if(this.hsioReturnForm.get('CustomerNameorNo').value == null
      || this.hsioReturnForm.get('CustomerNameorNo').value == ''){
      this._toster.warning('Please Select Customer', 'Warning');
      return;
    }

    if(this.hsioReturnForm.get('hsiono').value == null
      || this.hsioReturnForm.get('hsiono').value == ''){
      this._toster.warning('Please Select HSIO No', 'Warning');
      return;
    }

    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_hsio_details_from_ile +
        this.hsioReturnForm.get('hsiono').value).then(result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.dataSource = new MatTableDataSource<get_bsio_details_from_ile>(result);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }else{
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

  calreturnqty(rowelement : any){
    if(rowelement.return_no_of_bags < 0){
      rowelement.return_no_of_bags = 0;
      this._toster.warning('Return No Of Bags can not be less than Zero', 'Error');
      return;
    }else {

      if(rowelement.return_no_of_bags <= rowelement.no_of_bags - rowelement.returned_no_of_bags){
        rowelement.return_quantity = parseFloat((rowelement.return_no_of_bags * rowelement.fg_pack_size).toFixed(2));
      }else{
        this._toster.warning('Return No Of Bags ('+rowelement.return_no_of_bags+') ' +
          'can not be greater than ('+(rowelement.no_of_bags - rowelement.returned_no_of_bags) +') because ' +
          'No Of Bags ('+rowelement.no_of_bags+') - Returned No Of Bags ('+rowelement.returned_no_of_bags+') ', 'Error');
        rowelement.return_no_of_bags = 0;
        rowelement.return_quantity = 0;
        return;
      }

    }
  }

  create_return_fsio(){

    if(this.hsioReturnForm.get('location').value == null
      || this.hsioReturnForm.get('location').value == ''){
      this._toster.warning('Please Select Location', 'Warning');
      return;
    }

    if(this.hsioReturnForm.get('CustomerNameorNo').value == null
      || this.hsioReturnForm.get('CustomerNameorNo').value == ''){
      this._toster.warning('Please Select Customer', 'Warning');
      return;
    }

    if(this.hsioReturnForm.get('hsiono').value == null
      || this.hsioReturnForm.get('hsiono').value == ''){
      this._toster.warning('Please Select HSIO No', 'Warning');
      return;
    }

    if(this.dataSource.data.length<=0){
      this._toster.error('Please Click Get Order For Fetching Records.', 'Error');
      return;
    }

    var create_return : Array<createreturnbsio> = [];

    for(let i = 0;i < this.dataSource.data.length ; i++){
      if(this.dataSource.data[i].return_no_of_bags != null){
        if(this.dataSource.data[i].return_no_of_bags > 0){
          var json = {
            ile_no : this.dataSource.data[i].ile_no,
            item_no : this.dataSource.data[i].item_no,
            item_name : this.dataSource.data[i].item_name,
            lot_no : this.dataSource.data[i].lot_no,
            no_of_bags : this.dataSource.data[i].return_no_of_bags,
            quantity : this.dataSource.data[i].return_quantity
          }
          create_return.push(json)
        }
      }
    }

    if(create_return.length<=0){
      this._toster.info('Please fill return no of bags.', 'Info');
      return;
    }

    const posted_json = {
      hsio_no: this.hsioReturnForm.get('hsiono').value,
      customer_no: this.hsioReturnForm.get('CustomerNameorNo').value,
      location_id: this.hsioReturnForm.get('location').value,
      created_by: this.sessionManageMent.getEmail,
      lines: create_return
    };

    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.create_hsio_return, posted_json).then(
      result => {
        if (result[0].condition.toLowerCase() == 'true') {
          this.spinner.hide();
          this._toster.success(result[0].message, 'Success');
          this.router.navigateByUrl('/return/returnhsiolist');
        } else {
          this._toster.info(result[0].message, 'Info');
        }
        this.spinner.hide();
      }).catch(error => {
      this.spinner.hide();
      this._toster.error(error, 'Exception');
    });

  }

  sum_footer(items: Array<get_bsio_details_from_ile>, attr: string): number {
    let sum_total: number = 0
    for (let i = 0; i < items.length; i++) {
      sum_total += parseInt( items[i][attr])
    }
    //return parseFloat(sum_total.toFixed(2));
    return sum_total;
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

}
