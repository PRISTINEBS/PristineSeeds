import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {Router} from "@angular/router";
import {isArray} from "rxjs/internal-compatibility";
import {FormControl} from "@angular/forms";
import {pristineSidebarService} from "../../../../@pristine/components/sidebar/sidebar.service";
import {navigation} from "../../../navigation/navigation";
import {pristineConfigService} from "../../../../@pristine/services/config.service";

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    navigation: any;
    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _pristineConfigService: pristineConfigService,
        private _pristineSidebarService: pristineSidebarService,
        public _sessionManagement: SessionManageMent,
        public  webApiHttp: WebApiHttp,
        public validateResponse: ValidateResponse,
        private _router: Router
    ) {

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }


    ngOnInit(): void {
        // Subscribe to the config changes
        this._pristineConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
    }

    LogoutFrom_Server() {
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.Logout, {
            Email: this._sessionManagement.getEmail
        }).then((result: Array<{
            condition: string;
            action: string;
            email_id: string;
            connection_id: string;
        }>) => {
            if (isArray(result) && this.validateResponse.checkObjectResponseCondition(result)) {
                try {
                    localStorage.clear();
                } catch (e) {
                } finally {
                    window.location.reload();
                }
            }
        }, err => {

        }).then(err1 => {

        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    toggleSidebarOpen(key): void {
        this._pristineSidebarService.getSidebar(key).toggleOpen();
    }

    AddNewUser() {
        this._router.navigateByUrl('/pages/auth/register-2');
    }

    search(value): void {

    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }


}
