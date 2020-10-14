import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Itemlist} from '../itemlist/itemlistmodel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {ActivatedRoute, Router} from '@angular/router';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {ItemGroupModel} from '../itemlist/itemcreation/itemcreationmodel';
import {itemgroupcreationComponent} from '../itemlist/itemcreation/itemgroupcreation/itemgroupcreation.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-itemgroup',
  templateUrl: './itemgroup.component.html',
  styleUrls: ['./itemgroup.component.scss']
})
export class ItemgroupComponent implements OnInit {

  displayedColumns: string[] = ['item_no', 'class_of_seed','male_female', 'created_by', 'created_on'];
  dataSource: MatTableDataSource<ItemGroupModel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public sessionManageMent: SessionManageMent,
    private webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService,
    private dialogActions: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.item_group_list();
  }

  item_group_list() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemGroupList).then(
        result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this.dataSource = new MatTableDataSource<ItemGroupModel>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this._toster.warning(result[0].message, 'Message');
          }
          this.spinner.hide();
          return;
          //console.log(this.dataSource);
        }
      ).catch(e => {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
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

  createnewitemgroup(){
    let dialogConfig=this.dialogActions.open(itemgroupcreationComponent,{
      width:'700px'
    })
    dialogConfig.afterClosed().subscribe(result=>{
      if(result=='true'){
        this.ngOnInit();
      }
    })
  }

}
