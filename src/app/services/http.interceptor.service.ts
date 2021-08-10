// import { LoadingService } from "src/app/core/services/loading.service";
import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap, catchError, map, finalize } from "rxjs/operators";

// import { JwtService } from "../services/jwt.service";
import { Router, ActivatedRoute } from "@angular/router";
// import swal from 'sweetalert2'
import { Location } from "@angular/common";
import { JwtService } from "./jwt.service";
import { LoadingService } from "./loading.service";
import { HttpCacheService } from "./http-cache.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import swal from "sweetalert2";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  routePath: string;
  serviceCount: number = 0;
  constructor(
    private jwtService: JwtService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private location: Location,
    private cacheService: HttpCacheService
  ) {
    this.route.url.subscribe((data) => {
      // Get the last piece of the URL
      this.routePath = data[0].path;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /*if (req.method !== "GET") {
      this.cacheService.invalidateCache();
      this.serviceCount++;
      this.loadingService.show();
      return next.handle(req);
    }
    // attempt to retrieve a cached response
    const cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);

    // return cached response
    if (cachedResponse) {
      console.log(`Returning a cached response: ${cachedResponse.url}`);
      console.log(cachedResponse);
      return of(cachedResponse);
      this.loadingService.hide();
    }*/
    const token = this.jwtService.getToken();
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    // console.log(decodedToken);
    const isExpired = helper.isTokenExpired(token);
    if (isExpired) {
      this.jwtService.destroyToken().then(() => {
        this.router.navigate(["/login"]);
      });
    }
    this.serviceCount++;
    this.loadingService.show();
    const headersConfig = {
      /* "Content-Type": "application/json",*/
      Accept: "application/json",
    };

    if (token) {
      headersConfig["Authorization"] = `Bearer ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request).pipe(
      catchError((error: any, caught: Observable<any>) => {
        if (error) {
          if (error.status === 401) {
            const message = error.error.status.message.friendlyMessage;
            if (message) {
              swal.fire("GOS FINANCIAL", message, "error").then(() => {
                this.handleAuthError();
              });
            } else {
              swal
                .fire(
                  "GOS FINANCIAL",
                  "Unauthorised, please log in again ",
                  "error"
                )
                .then(() => {
                  this.handleAuthError();
                });
            }
          }
        }
        throw error;
      }),
      finalize(() => {
        this.serviceCount--;

        if (this.serviceCount === 0) {
          this.loadingService.hide();
        }
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
    this.router.navigate(["/login"], {
      queryParams: { returnUrl: this.routePath },
    });
  }
}
