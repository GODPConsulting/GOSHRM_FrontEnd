import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreModule } from '@core/core.module';
// import { AutoLogoutService } from '@core/services/auto-logout.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { OfflineComponent } from './offline/offline.component';
import { TraningProviderComponent } from './training-provider/traning-provider.component';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    AppComponent, 
    NotFoundComponent, 
    OfflineComponent, 
    TraningProviderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    JwtModule.forRoot({
      config: {},
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    LocalStorageService,
    { provide: 'WINDOW', useValue: window },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: (as: AutoLogoutService) => () => {
    //     return as.run();
    //   },
    //   deps: [AutoLogoutService],
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}