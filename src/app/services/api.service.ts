import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  //authKey;
  constructor(private http: HttpClient) {}
  private handleError(error: any) {
    return throwError(error.error);
  }
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.handleError));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(`${environment.api_url}${path}`, JSON.stringify(body))
      .pipe(catchError(this.handleError));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, JSON.stringify(body))
      .pipe(catchError(this.handleError));
  }
  /* 
  download() {
    return this.http.get(
      "http://godp.co.uk:72/api/v1/hrmsetup/download/academic/disciplines"
    );
  }
 */
  /*  download(x):Observable<any> {
    //this.authKey =localStorage.getItem('token')
  const param = new HttpParams().set('filename',x)
  const options = {
    params:param
  }
  return this.http.get("http://godp.co.uk:72/api/v1/hrmsetup/download/academic/disciplines",{...options,responseType: 'blob'})
}  */
}
