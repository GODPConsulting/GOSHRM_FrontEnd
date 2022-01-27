import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from '@shared/services/local-storage.service';
// import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  constructor(
    private localStorageAS: LocalStorageService,
    private _jwt: JwtHelperService,
    private router: Router
  ) {}

  public logOut(): void {
    localStorage.clear();
    this.localStorageAS.clear();
    this.router.navigate(['authentication/login']);
  }

  public isLoggedIn(): boolean {
    const GOS_token = JSON.parse(
      localStorage.getItem('GOS_token') || 'null'
    );
    // const currentUser = JSON.parse(
    //   localStorage.getItem('GOS_user_credential') || 'null'
    // );
    if (
      GOS_token !== null &&
      GOS_token !== undefined &&
      !this._jwt.isTokenExpired(GOS_token)
      // &&
      // currentUser !== undefined &&
      // currentUser !== null
    ) {
      return true;
    }
    return false;
  }

  public getUserDetails(): any {
    return this.decrypt_jwt(this.getAuthToken());
  }

  /**
   *
   * @param GOS_token
   * @returns
   * TODO:
   * -Setup when you see the structure
   */

  public storeUserCredentials(responseData: any): void {
    const jwtData: any = this.decrypt_jwt(responseData);
    const data_to_store = {
      email: jwtData.email,
      userId: jwtData.userId,
    };
    localStorage.setItem('user_credential', JSON.stringify(data_to_store));
    localStorage.setItem('GOS_token', JSON.stringify(responseData));
  }

  public storeUserDetails(userDetails: any) {
    const user_data_to_store = {
      userName: userDetails.userName,
      userId: userDetails.userId,
      full_Name: userDetails.firstName,
      trainingProviderId: userDetails.trainingProviderId,
      customerTypeId: userDetails.customerTypeId
    };
    this.localStorageAS.set('GOS_user_details', user_data_to_store);
  }

  private decrypt_jwt(GOS_token: string): any {
    if (GOS_token) {
      const decoded = this._jwt.decodeToken(GOS_token);
      return decoded;
    }
    return null;
  }

  public getAuthToken(): string {
    const GOS_token = JSON.parse(
      localStorage.getItem('GOS_token') || 'null'
    );
    return GOS_token;
  }

  public getUser(): Observable<any> {
    return JSON.parse(localStorage.getItem('GOS_user_details') || 'null');
  }
}
