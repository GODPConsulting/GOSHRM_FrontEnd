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

@NgModule({
  declarations: [AppComponent, AuthWrapperComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule,
    // NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 1500,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }),
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
