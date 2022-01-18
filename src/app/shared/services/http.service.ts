import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getRequest<T>(
    endpoint: string,
    baseUrl: string = environment.api_url
  ): Observable<T> | any {
    return this.http.get(baseUrl + endpoint);
  }

  getRequestWithParams<T>(
    endpoint: string,
    params = {},
    baseUrl = environment.api_url
  ): Observable<T> | any {
    return this.http.get(baseUrl + endpoint, {
      params,
    });
  }

  makeRequestWithData<T>(
    method: 'post' | 'put' | 'patch' | 'get',
    endpoint: string,
    params: any,
    body?: any,
    headers: HttpHeaders = new HttpHeaders({}),
    baseUrl: string = environment.api_url
  ): Observable<T> | any {
    return this.http.request(method, baseUrl + endpoint, {
      params,
      body,
      headers,
    });
  }
}
