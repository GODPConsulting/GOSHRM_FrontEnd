import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Profile } from '../models/user-profile.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

constructor(private http: HttpService) { }

  public getProfile(
      getProfile: Profile
    ): Observable<ResponseModel<Profile>> {
      const endpoint = 'ArchiveFolders/search-archives';
      return this.http.makeRequestWithData('post', endpoint, {}, getProfile);
  }

}
