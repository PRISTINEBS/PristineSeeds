import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {Login2Service} from "./login-2.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginModel} from "./LoginModel";
import {pristineNavigationService} from "../../../../../@pristine/components/navigation/navigation.service";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {SignalR} from "../../../../../@pristine/process/SignalR";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {receiverData} from "../../../../modal/SignalRModel";
import {ToastrService} from "ngx-toastr";
import {navigation} from "../../../../navigation/navigation";
import {pristineAnimations} from "../../../../../@pristine/animations";
import {pristineConfigService} from "../../../../../@pristine/services/config.service";


@Component({
    selector: 'login-2',
    templateUrl: './login-2.component.html',
    styleUrls: ['./login-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: pristineAnimations
})
export class Login2Component implements OnInit, OnDestroy {
    loginForm: FormGroup;
    loading: boolean = false;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * Constructor
     *
     * @param {pristineConfigService} _pristineConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _pristineConfigService: pristineConfigService,
        private _formBuilder: FormBuilder,
        private _toastr: ToastrService,
        private _sessionManageMent: SessionManageMent,
        private _validateResponse: ValidateResponse,
        private _router: Router,
        private _login2Service: Login2Service,
        private _snackBar: MatSnackBar,
        private _pristineNavigationService: pristineNavigationService,
        private _signalR: SignalR,
        private _webapiHttp: WebApiHttp
    ) {
        // Configure the layout
        this._pristineConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        //TODO go to login page when use is unauthorized..
        if (this._sessionManageMent.getEmail != '')

            this._router.navigateByUrl('/dashboard/maindashboard');
        else
            this._router.navigateByUrl('/pages/auth/login-2');
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', Validators.required]
        });

    }

    loginUser(formdata: { email: string, password: string }): void {
        this.loading = true;
        var json = {Email: formdata.email, password: formdata.password};
        this._login2Service.getLoginAccess(json).then((result: Array<LoginModel>) => {
            if (this._validateResponse.checkArray(result)) {
                if (this._validateResponse.checkArrayResponseCondition(result) == true) {
                    // let temp: PristineNavigation[] = navigation;
                    navigation[0].children = result[0].menu;
                    //temp = navigationProject;
                    //todo set sesion for this website;
                    this._sessionManageMent.setEmailSession(formdata.email);
                    this._sessionManageMent.setRoleSession(result[0].roleId);
                    this._sessionManageMent.setMenuSession(navigation);
                    this._sessionManageMent.setNameSession(result[0].name);
                    this._sessionManageMent.setLocationId(result[0].locationId);

                    this._sessionManageMent.setPickType(result[0].pick);


                    this._sessionManageMent.setGateEntryRequired(result[0].gateentry);
                    this._sessionManageMent.setBarcode(result[0].barcode);

                    this._sessionManageMent.setShift_IdSession(result[0].shiftID);
                    this._sessionManageMent.setWork_Type(result[0].workType);

                    this._sessionManageMent.setLocationNameSession((result[0].location_name == null || result == undefined) ? 'Wrong' : result[0].location_name);
                    //todo end Session
                    this._pristineNavigationService.register('main', navigation);
                    this._pristineNavigationService.setCurrentNavigation('main');
                    this._signalR.startConnection(this._sessionManageMent.getEmail, this._webapiHttp.globalurl + this._webapiHttp.ApiURLArray.signalRNotification);
                    receiverData.subscribe(result => {
                        try {
                            if (result.action == 'Logout') {
                                localStorage.clear();
                                window.location.reload();
                            }
                        } catch (e) {

                        }
                    });
                    this._router.navigateByUrl('/dashboard/maindashboard');
                } else {
                    this._toastr.error('Error', result[0].message);
                    // this._toastr.onError('Error', result.message);
                    this.loading = false;
                }
            } else {
                this._toastr.error('Error', result[0].message);
                // this._toastr.onError('Error', result[0].message);
                this.loading = false;
            }
        }).catch(err => {
            this.loading = false;
        });
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Clear', {
            duration: 5000,
        });
    }

    ngOnDestroy(): void {
    }
}
