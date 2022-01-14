import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { environment } from "../../environments/environment";
import { JwtService } from "./jwt.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) {}

  handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }
  userLogin(payload): Observable<any> {
    // let body = { userName: userName, password: password };
    const reqHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return (
      this.http
        .post("http://107.180.93.38:5050/identity/login", JSON.stringify(payload), {
        //.post(environment.api_url + "/identity/login", JSON.stringify(payload), {
            headers: reqHeaders,
          })
        .pipe(
          map((data) => {
            // this.setUser(data["userFromRepo"], data["activities"]);
            return data;
          }),
          catchError(this.handleError)
        )
    );
  }
  getProfile(): Observable<any> {
    return this.http.get(`http://107.180.93.38:5050/identity/profile`).pipe(tap((data) => {
    //return this.apiService.get(`/identity/profile`).pipe(tap((data) => {
        return data;
      })
    );
  }
  loggedIn() {
    return this.jwtService.getToken() ? true : false;
  }
  clearSession() {
    this.jwtService.destroyToken().then(() => {
      this.router.navigateByUrl("/login");
    });
  }
}
