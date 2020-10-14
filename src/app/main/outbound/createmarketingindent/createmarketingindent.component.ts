import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {CropCodeList, itemGroupList, MarketingIndentLines, SessionList} from './createmarketingindent';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe, formatPercent} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {
  categorymodel,
  subcategorymodel
} from '../../admin/itemmanagement/itemlist/itemcreation/itemcreationmodel';
import {CustomerList, FullCustomerInfo} from '../../ordermanagement/saleorder/createsaleorder/createsaleordermodel';
import {max} from 'rxjs/operators';

@Component({
    selector: 'app-createmarketingindent',
    templateUrl: './createmarketingindent.component.html',
    styleUrls: ['./createmarketingindent.component.scss']
})

export class CreatemarketingindentComponent implements OnInit {

    displayedColumns: string[] = ['crop_code', 'variety_group', 'booking_quantity', 'alloted_quantity', 'alloted_percentage', 'Action'];
    dataSource: MatTableDataSource<MarketingIndentLines> = null;

    @ViewChild('matpaginator', {static: true}) paginator: MatPaginator;
    @ViewChild('matSort', {static: true}) sort: MatSort;

    registerForm: FormGroup;
    addLineForm: FormGroup;
    ItemCategoryList: Array<CropCodeList> = [];
    ItemSubcategoryList: Array<itemGroupList> = [];
    MarketingIndentLine: Array<MarketingIndentLines>;
    currentdate: any = Date.now();
    customerlist: CustomerList[];
    addresslist: FullCustomerInfo[];
    sessionList: Array<SessionList> = [];
    searchByCustomerNameorNo = '';


    constructor(
        public sessionManageMent: SessionManageMent,
        private webApiHttp: WebApiHttp,
        private _formBuilder: FormBuilder,
        private _toster: ToastrService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe
    ) {
        this.registerForm = this._formBuilder.group({
          Address: [''],
          Address2: ['' ],
          Name: ['' ],
          Name2: [''],
          CustomerNameorNo: ['', Validators.required],
          CustomerNo: [''],
          Zone: [''],
          State: [''],
          Region: [''],
          District: [''],
          Taluka: [''],
          Date: ['', Validators.required],
          Session: ['', Validators.required],
            // FreightAmount: ['0'],
        });

        this.addLineForm = _formBuilder.group({
          CropCode: ['', Validators.required],
          VarietyGroup: ['', Validators.required],
          BookingQuantity: [0, Validators.required],
          AllotedQuantity: [0, Validators.required],
          AllotedPercetage: [0, [Validators.required, Validators.max(100)]],
        });

        this.dataSource = new MatTableDataSource<MarketingIndentLines>(this.MarketingIndentLine);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

    }

    ngOnInit(): void {
        this.get_SessionMaster();
        this.GetCropCode();
        this.get_CustomerNo();
    }

  get_SessionMaster(){
      try {
        this.spinner.show();
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetSeasonMaster).then(result => {
          console.log(result);
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true'){
            this.sessionList = result as SessionList[];
          }else{
            this._toster.warning('Session Not Found', 'Message');
          }
        }, err => {
          this._toster.error(err, 'Error');
        }).finally(() => {
          this.spinner.hide();
        });
      }catch (e) {
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
      });
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }

  get_CustomerFull_info() {
    try {
      if (this.registerForm.get('CustomerNameorNo').value != undefined && this.registerForm.get('CustomerNameorNo').value != 'None' && this.registerForm.get('CustomerNameorNo').value != '') {
        this.spinner.show();
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CustomerInfo + this.registerForm.get('CustomerNameorNo').value).then(result => {
          this.addresslist = result as FullCustomerInfo[];
          this.registerForm.get('CustomerNo').setValue(this.addresslist[0].customer_id);
          this.registerForm.get('Name').setValue(this.addresslist[0].full_name);
          // this.registerForm.get('Name2').setValue(this.addresslist[0].full_name)
          this.registerForm.get('Address').setValue(this.addresslist[0].address);
          this.registerForm.get('Address2').setValue(this.addresslist[1]?.address);
          this.registerForm.get('Zone').setValue(this.addresslist[0].zone);
          this.registerForm.get('State').setValue(this.addresslist[0].state);
          this.registerForm.get('Region').setValue(this.addresslist[0].region);
          this.registerForm.get('District').setValue(this.addresslist[0].district);
          this.registerForm.get('Taluka').setValue(this.addresslist[0].taluka);

          if (result[0].condition.toLowerCase() != 'true') {
            this._toster.error(result[0].message, 'Error');
          }
          this.spinner.hide();
        }).catch(e => {
          this._toster.error(e, 'Error');
          this.spinner.hide();
        });
      }
    } catch (e) {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }
  }

  GetCropCode(){
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.CropCodeList)
          .then(result => {
            if (Array.isArray(result) && result.length) {
              this.ItemCategoryList = result as CropCodeList[];
            } else {
              this._toster.error('error', 'category not found');
            }
          }, error => {
            this._toster.error('error', error);
          }).finally(() => {
            this.spinner.hide();
        });
    } catch (e) {
      this._toster.error('error', e);
    }
  }

  getItemSubCategory(data) {
    try {
      if (data != undefined){
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetitemGroup + data)
          .then(result => {
            if (Array.isArray(result) && result.length) {
              this.ItemSubcategoryList = result as itemGroupList[];
            } else {
              this._toster.error('error', 'Sub category not found');
            }
          }, error => {
            this._toster.error('error', error);
          });
      }
    } catch (e) {
      this._toster.error('error', e);
    }
  }

  AddLines(){
      try {
        if (this.addLineForm.get('BookingQuantity').value > 0 && this.addLineForm.get('AllotedQuantity').value > 0) {

          const addlines: MarketingIndentLines = {
            condition: 'true',
            message : '',
            crop_code: this.addLineForm.get('CropCode').value,
           // challan_date:this.datePipe.transform(this.addLineForm.get('challan_date').value.toLocaleString(), 'MM-dd-yyyy'),
            variety_group: this.addLineForm.get('VarietyGroup').value,
            alloted_quantity: this.addLineForm.get('AllotedQuantity').value,
            booking_quantity: parseInt(this.addLineForm.get('BookingQuantity').value),
            alloted_percentage: this.addLineForm.get('AllotedPercetage').value,
          };

          this.MarketingIndentLine = new Array<MarketingIndentLines>();
          this.MarketingIndentLine.push(addlines);

          this.addLineForm.get('CropCode').setValue('');
          this.addLineForm.get('VarietyGroup').setValue('');
          this.addLineForm.get('AllotedQuantity').setValue(0);
          this.addLineForm.get('BookingQuantity').setValue(0);
          this.addLineForm.get('AllotedPercetage').setValue(0);

          if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
            this.dataSource = new MatTableDataSource<MarketingIndentLines>(this.MarketingIndentLine);
          } else {
            this.dataSource.data.push(addlines);
            this.dataSource = new MatTableDataSource<MarketingIndentLines>(this.dataSource.data);
          }

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        } else if (this.addLineForm.get('AllotedQuantity').value <= 0) {
          this._toster.warning('Put Some Quantity Before Adding it.', 'Warning');
        } else if (this.addLineForm.get('BookingQuantity').value <= 0) {
          this._toster.warning('Put Some Quantity Before Adding it.', 'Warning');
        }
      } catch (e) {
        this._toster.error(e, 'Error');
        this.spinner.hide();
      }
    }

  CreatemarketingIndent() {

    if (this.dataSource.data.length <= 0){
      this._toster.error('Please add minimum 1 line to create', 'Error');
      return;
    }
    try {
        // console.log(this.registerForm.value);
        this.spinner.show();
        const json = {
          location_id: this.sessionManageMent.getLocationId,
          Customer_no: this.registerForm.get('CustomerNo').value,
          seasion: this.registerForm.get('Session').value,
          date: this.datePipe.transform(this.registerForm.get('Date').value.toLocaleString(), 'MM-dd-yyyy'),
          created_by: this.sessionManageMent.getEmail,
          marketing_indent_line: this.dataSource.data
        };
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateMarketingIndent, json).then(result => {
            if (result[0].condition.toLowerCase() === 'true') {
                this._toster.success(result[0].message, 'Message');
                this.spinner.hide();
                this.router.navigateByUrl('/outbound/marketingindentlist');
            } else {
                this.spinner.hide();
                this._toster.error(result[0].message, 'Error');
            }
        }).catch(e => {
            this.spinner.hide();
            this._toster.error(e, 'Error');
        });
    } catch (e) {
        this.spinner.hide();
        this._toster.error(e, 'Error');
    }
  }

  delete_line(element: any) {
    this.dataSource.data.splice(this.dataSource.data.indexOf(element), 1);
    this.dataSource = new MatTableDataSource<MarketingIndentLines>(this.dataSource.data);
  }

  sum_footer(items: Array<MarketingIndentLines>, attr: string): number {
    let sum_total = 0;
    for (let i = 0; i < items.length; i++) {
      sum_total += parseInt( items[i][attr]);
    }
    // return parseFloat(sum_total.toFixed(2));
    return sum_total;
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

  getpercentagevalue(){
    let value: number;
    value = (this.addLineForm.get('AllotedQuantity').value * 100 / this.addLineForm.get('BookingQuantity').value);
    this.addLineForm.get('AllotedPercetage').setValue(Math.round(value));
  }
  getAllotedQuantity(){
    let value: number;
    value = (this.addLineForm.get('AllotedPercetage').value * this.addLineForm.get('BookingQuantity').value / 100);
    this.addLineForm.get('AllotedQuantity').setValue(Math.round(value));
  }
}
