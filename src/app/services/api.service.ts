import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";
import { JwtService } from "./jwt.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  //authKey;
  constructor(private http: HttpClient, private jwtService: JwtService) {}
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
      .post(`${environment.api_url}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  delete(path): Observable<any> {
    return this.http
      .delete(`${environment.api_url}${path}`)
      .pipe(catchError(this.handleError));
  }

  getExcel(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.handleError));
  }

  uploadFSTemplate(path, file: File, body: any) {
    return new Promise((resolve, reject) => {
      let url = `${environment.api_url}${path}`;
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open("POST", url, true);
      let formData = new FormData();
      formData.append("Image", file, file.name);

      formData.append("companyId", body.companyStructureId);

      const token = this.jwtService.getToken();
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  updateCompanyStructure(file: File, body: any, file2: File) {
    return new Promise((resolve, reject) => {
      let url = `${environment.api_url}/company/add/update/companystructure`;

      let xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open("POST", url, true);
      let formData = new FormData();
      if (file2) {
        formData.append('fSTemplate', file2, file2.name);
      }
      if (file) {
        formData.append("file", file, file.name);
      }

      for (var key in body) {
        formData.append(key, body[key]);
      }

      let token = this.jwtService.getToken();
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  /* downloadLink() {
    return this.http.get(
      "http://godp.co.uk:72/api/v1/hrmsetup/download/academic/disciplines",
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  } */

  getDownload(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.handleError));
  }
  /* */
  /*  download(x):Observable<any> {
    //this.authKey =localStorage.getItem('token')
  const param = new HttpParams().set('filename',x)
  const options = {
    params:param
  }
  return this.http.get("http://godp.co.uk:72/api/v1/hrmsetup/download/academic/disciplines",{...options,responseType: 'blob'})
}  */

  addCertificate(path, body, file: File) {
    return new Promise((resolve, reject) => {
      let url = `${environment.api_url}${path}`;

      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open("POST", url, true);
      let formData = new FormData();
      formData.append("qualificationFile", file, file.name);
      for (var key in body) {
        formData.append(key, body[key]);
      }
      const token = this.jwtService.getToken();
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  }

  uploadExcel(path, file: File) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open("POST", url, true);
      const formData = new FormData();
      formData.append("file", file, file.name);
      console.log(formData);

      const token = this.jwtService.getToken();
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.send(formData);
      console.log(formData);
    });
  }
}
