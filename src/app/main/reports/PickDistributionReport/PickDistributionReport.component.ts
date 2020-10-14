import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {PickDistributionReportService} from "./PickDistributionReport.service";
import {MatSort} from "@angular/material/sort";
import {PickDistributionReportMOdel} from "../../../modal/ReportModel";

@Component({
    selector: 'PickDistributionReport',
    templateUrl: './PickDistributionReport.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./PickDistributionReport.component.scss']
})
export class PickDistributionReportComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ["id", "pick_person_id", "pick_no", "work_type", "pick_zone", "start_bin", "end_bin", "is_running", "distribution_create_datetime", "zone_enter_datetime"];
    dataSource: MatTableDataSource<PickDistributionReportMOdel>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(public pickDistributionReportService: PickDistributionReportService,) {

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

    ngOnInit() {
        this.dataSource = new MatTableDataSource<PickDistributionReportMOdel>(this.pickDistributionReportService.PickDistribution_list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngAfterViewInit(): void {

    }
}


