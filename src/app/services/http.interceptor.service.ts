// import { LoadingService } from "src/app/core/services/loading.service";
import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";

// import { JwtService } from "../services/jwt.service";
import { Router, ActivatedRoute } from "@angular/router";
// import swal from 'sweetalert2'
import { Location } from "@angular/common";
import { JwtService } from "./jwt.service";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  routePath: string;
  constructor(
    private jwtService: JwtService,
    private router: Router,
    // private loadingService: LoadingService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.route.url.subscribe((data) => {
      this.routePath = data[0].path;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {
      /* "Content-Type": "application/json",*/
      Accept: "application/json",
    };

    const token = this.jwtService.getToken();

    if (token) {
      headersConfig["Authorization"] = `Bearer ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request).pipe(
      catchError((error: any, caught: Observable<any>) => {
        if (error.status === 1100) {
          // this.jwtService.saveToken()
        }
        if (error.status === 401) {
          this.handleAuthError();
        }
        // if (error.status === 403) {
        //   // this.loadingService.hide()
        //   const message = error.error.Status.Message.FriendlyMessage
        //   swal.fire('Error', message, 'error').then(() => {
        //     this.location.back()
        //   });
        //   if (message === null) {
        //     const message = 'You do not have privilege to perform this action';
        //     swal.fire('Error', message, 'error').then(() => {
        //       this.location.back()
        //     });
        //   }
        //
        //   // this.handleAuthError();
        // }
        // if (error.status === 502) {
        //   this.handleAuthError()
        // }
        throw error;
      })
    );
  }
  private handleAuthError() {
    // this.loadingService.hide();
    // Remove JWT from localstorage
    // this.jwtService.destroyToken();
    // // Remove USER from localstorage
    // this.jwtService.destroyUser();
    //
    // this.jwtService.destroyUserDetails();
    //
    // this.jwtService.destroyAccountType();
    // // Set current user to an empty object

    localStorage.clear();
    // navigate back to the login page
    this.router.navigate(["/auth/login"], {
      queryParams: { returnUrl: this.routePath },
    });
  }
}
