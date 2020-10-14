import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../@pristine/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {pristineProgressBarModule, pristineSidebarModule, pristineThemeOptionsModule} from "../@pristine/components";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {NgxSpinnerModule} from "ngx-spinner";
import {ToastrModule} from "ngx-toastr";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {pristineModule} from "../@pristine/pristine.module";
import {pristineConfig} from "./pristine-config";
import {LayoutModule} from "./layout/layout.module";

const appRoutes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'plantinginspection',
    loadChildren: () => import('./main/plantinginspection/plantinginspection.module').then(m => m.PlantinginspectionModule)
  },
  {
    path: 'processtransfer',
    loadChildren: () => import('./main/processtransfer/processtransfer.module').then(m => m.ProcesstransferModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'inbound',
    loadChildren: () => import('./main/inbound/inbound.module').then(m => m.InboundModule)
  },
  {
    path: 'masters',
    loadChildren: () => import('./main/master/master.module').then(m => m.MasterModule)
  },
  {
    path: 'return',
    loadChildren: () => import('./main/return/return.module').then(m => m.ReturnModule)
  },
  {
    path: 'outbound',
    loadChildren: () => import('./main/outbound/outbound.module').then(m => m.OutboundModule)
  }, {
    path: 'ordermanagement',
    loadChildren: () => import('./main/ordermanagement/ordermanagement.module').then(m => m.OrdermanagementModule)
  },
  {
    path: 'vendormanagement',
    loadChildren: () => import('./main/vendormanagement/vendormanagement.module').then(m => m.VendormanagementModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./main/reports/Reports.module').then(m => m.ReportsModule)
  },
  {
    path: 'setup',
    loadChildren: () => import('./main/Setup/Setup.module').then(value => value.SetupModule)
  },
  {
    path: 'manifest',
    loadChildren: () => import('./main/manifest/ManifestPage.module').then(value => value.ManifestPageModule)
  }, {
    path: 'internal',
    loadChildren: () => import('./main/internal/internal.module').then(value => value.internalModule)
  },
  {
    path: '**',
    redirectTo: '/dashboard/maindashboard'
  }
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      countDuplicates: true,
      resetTimeoutOnDuplicate: true,
      progressBar: true,
      progressAnimation: "decreasing",
      closeButton: true,

    }), // ToastrModule added
    NgxSpinnerModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    // Material moment date module
    MatMomentDateModule,

    // Material
    MatButtonModule,
    MatIconModule,

    // pristine modules
    pristineModule.forRoot(pristineConfig),
    pristineProgressBarModule,
    pristineSharedModule,
    pristineSidebarModule,
    pristineThemeOptionsModule,


    // App modules
    LayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
