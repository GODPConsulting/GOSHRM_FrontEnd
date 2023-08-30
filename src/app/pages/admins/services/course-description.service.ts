import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CourseDescriptionService {
  constructor(private http: HttpService) {}

  public getAllAdmins(): Observable<ResponseModel<any>> {
   const endpoint = '/get/all/admins';
   return this.http.getRequest(endpoint);
  }

}
