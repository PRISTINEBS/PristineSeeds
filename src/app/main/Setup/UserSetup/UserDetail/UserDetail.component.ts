import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {changeIPDialogComponent} from "../ChangeIP-dialog/ChangeIP-dialog.component";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {PristineConfirmDialogInputComponent} from "../../../../../@pristine/components/confirm-dialog-input/confirm-dialog-input.component";
import {MatDialog} from "@angular/material/dialog";
import {pristineAnimations} from "../../../../../@pristine/animations";
import {createUserDialogComponent} from "../CreateUser-dialog/CreateUser-dialog.component";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {PromiseResponse} from "../../../../modal/PromiseResponse";
import {ExcelService} from "../../../../../@pristine/process/excel.Service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'UserDetail',
    templateUrl: './UserDetail.component.html',
    styleUrls: ['./UserDetail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: pristineAnimations
})
export class UserDetailComponent implements OnInit {

    dataSource: MatTableDataSource<any>;
    dataColumns: string[] = [];
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private webapiHttp: WebApiHttp,
                public composeDialog: MatDialog,
                private pristineToaster: ToastrService,
                private spinner: NgxSpinnerService,
                public excelService: ExcelService) {
    }

    ngOnInit(): void {
        try {
            this.webapiHttp.Get(this.webapiHttp.ApiURLArray.GetAllUser)
                .then(result => {
                    if (result[0].condition == 'True') {
                        this.dataSource = new MatTableDataSource<any>(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                }, error => {
                    console.log(error)
                })
        } catch (e) {
            console.log(e)
        }
    }

    AddUserDetail() {
        const dailogRef = this.composeDialog.open(createUserDialogComponent, {
            width: '600px'
        });
        dailogRef.afterClosed().subscribe(result => {
            this.ngOnInit();
        })

    }

    EditUser(data) {
        const dialogRef = this.composeDialog.open(PristineConfirmDialogInputComponent);
        dialogRef.componentInstance.inputFieldMessage = 'Enter New Password';
        dialogRef.componentInstance.confirmMessage = 'Change Password';
        dialogRef.componentInstance.addbutton = 'Update';
        dialogRef.afterClosed().subscribe((result: PromiseResponse) => {
            if (result.condition == 'true') {
                const json = {
                    Email: data.data.email,
                    password: result.message
                };
                try {
                    this.webapiHttp.Post(this.webapiHttp.ApiURLArray.UpdateUserPassword, json)
                        .then(result => {
                            let response: Array<{ condition: string; message: string }> = result;
                            if (response[0].condition.toLowerCase() == 'true') {
                                this.pristineToaster.success(response[0].message, 'Success');
                                this.ngOnInit();
                            } else {
                                this.pristineToaster.error(response[0].message, 'Error')
                            }
                        }, error => {
                            console.log(error)
                        })
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }

    downloadExcel() {
        for (let i = 0; i < this.dataSource.data.length; i++) {
            delete this.dataSource.data[i].condition
        }
        this.excelService.exportAsExcelFile(this.dataSource.data, 'UserData')
    }

    onIPchange(data: any) {
        const ipchange = this.composeDialog.open(changeIPDialogComponent, {width: '400px'});
        if (data.data.printerIP == null || data.data.printerIP == '') {
            ipchange.componentInstance.ipcontrol.setValue('192.168.1.1');
            ipchange.componentInstance.portcontrol.setValue(9100);
        } else {
            ipchange.componentInstance.ipcontrol.setValue(data.data.printerIP);
            ipchange.componentInstance.portcontrol.setValue(data.data.printerPort);
        }

        ipchange.componentInstance.email = data.data.email;
        ipchange.afterClosed().subscribe((value: boolean) => {
            if (value) {
                this.ngOnInit();
            }
        }, error => {
            this.ngOnInit();
        })
    }
}
   