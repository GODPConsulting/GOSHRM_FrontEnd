import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { JwtService } from "./jwt.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) {}

  userLogin(payload): Observable<any> {
    // let body = { userName: userName, password: password };
    let reqHeaders = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return (
      this.http
        //.post("http://104.238.103.48:70/identity/login", JSON.stringify(payload), {
        .post(
          environment.api_url + "/identity/login",
          JSON.stringify(payload),
          {
            headers: reqHeaders
          }
        )

        .pipe(
          map(data => {
            // this.setUser(data["userFromRepo"], data["activities"]);
            return data;
          })
        )
    );
  }
  loggedIn() {
    return this.jwtService.getToken() ? true : false;
  }
  clearSession() {
    this.jwtService.destroyToken().then(() => {
      this.router.navigateByUrl('/login')
    });
  }
}
