import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CurrentUserService } from '../services/current-user.service';
import { BaseComponent } from '../base/base/base.component';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _currentUser: CurrentUserService,
    private _base: BaseComponent,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const headers: any = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    };

    if (request.url.includes('login')) {
      const loginRequest = request.clone({
        setHeaders: headers,
      });
      return next.handle(loginRequest);
    }
    const withoutAuth = request.headers.get('Without-Auth');
    if (withoutAuth) {
      return this.continueWithoutAuth(request, next, headers);
    }
    headers['Authorization'] = `Bearer ${this._currentUser.getAuthToken()}`;
    const newRequest = request.clone({ setHeaders: headers });
    const ifConnected = window.navigator.onLine;

    if (ifConnected) {
      return next.handle(newRequest).pipe(
        tap(
          (event: any) => {
            if (newRequest.method != 'GET' && event['body']) {
            }
            if (event instanceof HttpResponse) {
            }
          },
          (err) => {
            if (err instanceof HttpErrorResponse) {
              this.handleError(err, newRequest, next);
            }
          }
        )
      );
    } else {
      this._base.openSnackBar('Internet not connected', 'error');
      return throwError({ message: 'Internet not connected' });
    }
  }

  private continueWithoutAuth(
    request: HttpRequest<any>,
    next: HttpHandler,
    globalHeaders: any
  ): Observable<any> {
    request = request.clone({
      setHeaders: globalHeaders,
    });
    return next.handle(request).pipe(
      tap(
        (event: any) => {
          if (request.method != 'GET' && event['body']) {
            // this._base.openSnackBarSuccess(event['body'].message);
          }
        },
        (err) => {
          if (err instanceof HttpErrorResponse) {
            console.log(err);
            this.handleError(err);
          }
        }
      )
    );
  }

  private handleError(
    error: HttpErrorResponse,
    newRequest?: HttpRequest<any>,
    next?: HttpHandler
  ) {
    if (error.error instanceof ErrorEvent) {
      this._base.openSnackBar(error.error?.message, 'error');
    } else {
      if (error.status === 401) {
        this.router.navigate(['login']);
        // this.handleRefresh(newRequest!, next!);
      }

      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    return throwError(error);
  }
  // private handleRefresh(request: HttpRequest<any>, next: HttpHandler) {
  //   const refreshToken = localStorage.getItem('refreshToken') as string;
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //     const token = this._currentUser.getAuthToken();
  //     if (token)
  //       return this._auth.refreshToken(JSON.parse(refreshToken)).pipe(
  //         map((res: ResponseModel) => {
  //           this.isRefreshing = false;
  //           this._currentUser.storeUserCredentials(res?.response);
  //           return next.handle(
  //             this.addTokenHeader(request, res?.response?.refreshToken)
  //           );
  //         }),
  //         catchError((err) => {
  //           this.isRefreshing = false;
  //           this._currentUser.logOut();
  //           return throwError(err);
  //         })
  //       );
  //   }
  //   return;
  // }
  // private addTokenHeader(request: HttpRequest<any>, token: string) {
  //   return (request = request.clone({
  //     setHeaders: {
  //       Accept: 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }));
  // }
}
