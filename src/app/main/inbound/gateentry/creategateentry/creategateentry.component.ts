import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {GateEntryLines, LocationList, Order, VendorList} from "./creategateentry";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {PostCode, StateCode} from "../../../admin/partymaster/partylist/partycreation/partycreationmodel";
import {Vendorlistmodel} from "../../../vendormanagement/vendorlist/vendorlistmodel";
import {MatTableDataSource} from "@angular/material/table";
import {
  ItemList,
  PurchaseOrderInfo,
  PurchaseOrderItemList
} from "../../../ordermanagement/purchaseorder/purchaseordercreate/purchaseordercreatemodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {BaseUomCodeModel, categorymodel} from "../../../admin/itemmanagement/itemlist/itemcreation/itemcreationmodel";

@Component({
    selector: 'app-creategateentry',
    templateUrl: './creategateentry.component.html',
    styleUrls: ['./creategateentry.component.scss']
})

export class CreategateentryComponent implements OnInit {

    displayedColumns: string[] = ['challan_no', 'challan_date','crop','description', 'baseuomid', 'no_of_bags', 'quantity', 'Action'];
    dataSource: MatTableDataSource<GateEntryLines> = null;

    @ViewChild("matpaginator", {static: true}) paginator: MatPaginator;
    @ViewChild("matSort", {static: true}) sort: MatSort;

    registerForm: FormGroup;
    addChallanForm: FormGroup;
    // freightType: string[] = ['Pay', 'To Pay'];
    CropType: Array<String> = ["COTTON","FIELD CROP", "VEGETABLE"]
    itemType: string[] = ['SEED' , 'NON-SEED'];
    ItemCategoryList: Array<categorymodel> = []
    GetBaseUom: Array<BaseUomCodeModel> = []
    vendorlist: Vendorlistmodel[];
    baseuom_desc: string = '';
    itemlist: ItemList[];
    searchByVendorNoorName: string = '';
    getvendorclassificationmaster: StateCode[]
    locationlist: LocationList[];
    gateEntrylist: Array<GateEntryLines>;
    start: boolean = false;
    currentdate: any = Date.now();


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
            vendor_classification: [null, Validators.required],
            vendor_no: [null , Validators.required],
            vendor_name: [null , Validators.required],
            vendor_mobile_no: [null , Validators.required],
            item_type: ['', Validators.required],
            VehicleNo: ['', Validators.required],
            DriverName: ['', Validators.required],
            DriverNumber: ['', Validators.required],
            Transpoter: ['', Validators.required],
            LRNo: ['', Validators.required],
            LRDate: ['', Validators.required],
            // Freight: ['', Validators.required],
            // FreightAmount: ['0'],
        });

        this.addChallanForm = _formBuilder.group({
          challan_no: ['', Validators.required],
          challan_date: ['', Validators.required],
          crop: [null, Validators.required],
          description: [''],
          baseuom: [null, Validators.required],
          no_of_bags: [0, Validators.required],
          Quantity: [0, Validators.required],
        });

        this.dataSource = new MatTableDataSource<GateEntryLines>(this.gateEntrylist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

    }

    ngOnInit(): void {
        this.get_crop();
        this.get_baseuom();
        this.get_vendor_classification_master()
        this.get_location();
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
            })
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Error');
        }
    }

    get_vendor_classification_master() {
      try {
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.getvendorclassificationmaster)
          .then(result => {
            if (Array.isArray(result) && result.length) {
              this.getvendorclassificationmaster = result as StateCode[];
            } else {
              this._toster.error('error', 'Vendor Classification Master Not Found')
            }
          }, error => {
            this._toster.error('error', error)
          })
      } catch (e) {
        this._toster.error('error', e)
      }
    }

    get_vendor_details() {
      try {
        this.spinner.show();
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetVendorDetailByClassification +
          this.registerForm.get('vendor_classification').value +
          '&no_or_name=' + this.searchByVendorNoorName).then(result => {
          if (result[0].condition.toLowerCase() === 'true') {
            this.vendorlist = result as Vendorlistmodel[];
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

    setVendorNameorMobileNo(vendor_list){
      this.registerForm.get('vendor_name').setValue(vendor_list.vendor_name);
      this.registerForm.get('vendor_mobile_no').setValue(vendor_list.mobile_no);
    }

    get_crop() {

      try {
          this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemCategoryListWithSeedType + 'SEED')
            .then(result => {
              if (Array.isArray(result) && result.length) {
                this.ItemCategoryList = result as categorymodel[];
              } else {
                this._toster.error('error', 'category not found');
                this.addChallanForm.get('crop').setValue('')
              }
            }, error => {
              this._toster.error('error', error)
            })
      } catch (e) {
        this._toster.error('error', e)
      }

    }

    get_baseuom() {

      try {
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetBaseUomValue)
          .then(result => {
            if (Array.isArray(result) && result.length) {
              this.GetBaseUom = result as BaseUomCodeModel[];
            } else {
              this._toster.error('error', 'Base UOM Not Found');
              this.addChallanForm.get('baseuom').setValue('')
            }
          }, error => {
            this._toster.error('error', error)
          })
      } catch (e) {
        this._toster.error('error', e)
      }

    }

    setbaseuomdesc(uom){
        this.baseuom_desc = uom.name;
    }

    AddChallan(){
      try {
        if (this.addChallanForm.get('Quantity').value > 0 && this.addChallanForm.get('no_of_bags').value > 0) {

          let addlines : GateEntryLines = {
            condition: 'true',
            message : '',
            challan_no:this.addChallanForm.get('challan_no').value,
            challan_date:this.datePipe.transform(this.addChallanForm.get('challan_date').value.toLocaleString(), 'MM-dd-yyyy'),
            crop:this.addChallanForm.get('crop').value,
            description:this.addChallanForm.get('description').value,
            baseuomid:this.baseuom_desc,
            baseuom:parseInt(this.addChallanForm.get('baseuom').value),
            no_of_bags:parseInt(this.addChallanForm.get('no_of_bags').value),
            quantity:parseInt(this.addChallanForm.get('Quantity').value),
          }

          this.gateEntrylist = new Array<GateEntryLines>();
          this.gateEntrylist.push(addlines);

          this.addChallanForm.get('challan_no').setValue('');
          this.addChallanForm.get('challan_date').setValue('');
          this.addChallanForm.get('crop').setValue('');
          this.addChallanForm.get('baseuom').setValue('');
          this.addChallanForm.get('no_of_bags').setValue(0);
          this.addChallanForm.get('Quantity').setValue(0);
          this.addChallanForm.get('description').setValue('');
          this.baseuom_desc = '';

          if (this.dataSource?.data?.length == undefined || this.dataSource?.data?.length == 0) {
            this.dataSource = new MatTableDataSource<GateEntryLines>(this.gateEntrylist);
          } else {
            this.dataSource.data.push(addlines);
            this.dataSource = new MatTableDataSource<GateEntryLines>(this.dataSource.data);
          }

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        } else if (this.addChallanForm.get('Quantity').value <= 0) {
          this._toster.warning('Put Some Quantity Before Adding it.', 'Warning');
        } else if (this.addChallanForm.get('no_of_bags').value <= 0) {
          this._toster.warning('Put At Least 1 Bag Before Adding it.', 'Warning');
        }
      } catch (e) {
        this._toster.error(e, 'Error');
        this.spinner.hide();
      }
    }

    CreategateEntry() {

        if(this.dataSource.data.length<=0){
          this._toster.error('Please Add Challan Details', 'Error');
          return;
        }

        try {
            console.log(this.registerForm.value);
            this.spinner.show();
            const json = {
                LocationId: this.sessionManageMent.getLocationId,
                VehicleNo: this.registerForm.get('VehicleNo').value,
                DriverName: this.registerForm.get('DriverName').value,
                DriverNumber: this.registerForm.get('DriverNumber').value,
                Transporter: this.registerForm.get('Transpoter').value,
                LRNo: this.registerForm.get('LRNo').value,
                LRDate: this.datePipe.transform(this.registerForm.get('LRDate').value.toLocaleString(), 'MM-dd-yyyy'),
                // Freight: this.registerForm.get('Freight').value,
                // FreightAmount: this.registerForm.get('FreightAmount').value,
                ItemType: this.registerForm.get('item_type').value,
                VendorNo: this.registerForm.get('vendor_no').value,
                // DocumentType: this.registerForm.get('DocumentType').value,
                // DocumentNo: this.registerForm.get('DocumentNo').value,
                // ChallanDate: this.datePipe.transform(this.registerForm.get('ChallanDate').value.toLocaleString(), 'MM-dd-yyyy'),
                // ChallanNo: this.registerForm.get('ChallanNo').value,
                // NoofBox: this.registerForm.get('NoofBox').value,
                CreatedBy: this.sessionManageMent.getEmail,
                // Description: this.registerForm.get('ItemDescription').value
                lines: this.dataSource.data
            }

            this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateGateEntry, json).then(result => {
                if (result[0].condition.toLowerCase() === 'true') {
                    this._toster.success(result[0].message, 'Message');
                    this.spinner.hide();
                    this.router.navigateByUrl('/inbound/gateentrylist');
                } else {
                    this.spinner.hide();
                    this._toster.error(result[0].message, 'Error');
                }
            }).catch(e => {
                this.spinner.hide();
                this._toster.error(e, 'Error');
            })
        } catch (e) {
            this.spinner.hide();
            this._toster.error(e, 'Error');
        }
    }

  delete_line(element: any) {

    this.dataSource.data.splice(this.dataSource.data.indexOf(element), 1);
    this.dataSource = new MatTableDataSource<GateEntryLines>(this.dataSource.data);
  }

  sum_footer(items: Array<GateEntryLines>, attr: string): number {
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
