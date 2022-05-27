import { FormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
// import { NgSelectModule } from '@ng-select/ng-select';

// Bootstrap DataTable
import { DataTablesModule } from "angular-datatables";
import { ToastrModule } from "ngx-toastr";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { HttpTokenInterceptor } from "./services/http.interceptor.service";
import { EmployeeAppraisalsComponent } from "./all-modules/manager/employee-appraisals/employee-appraisals.component";
import { AuthWrapperComponent } from "./components/auth-wrapper/auth-wrapper.component";
import { SentenceCasePipe } from "./pipes/sentence-case.pipe";
import { ToFixedPipe } from "./pipes/to-fixed.pipe";
import { PortalModule } from "@angular/cdk/portal";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";

@NgModule({
  declarations: [AppComponent, AuthWrapperComponent, ToFixedPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule,
    FormsModule,
    // NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 1500,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),

    // PortalModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
