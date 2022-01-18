import { ForgotPassswordDTO, LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, ResetPasswordDTO } from './../models/auth.model';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpService) {}

  public login(
    loginRequestDTO: LoginRequestDTO
  ): Observable<ResponseModel<LoginResponseDTO>> {
    const endpoint = 'auth/int/company-admin/login';
    return this.http.makeRequestWithData('post', endpoint, {}, loginRequestDTO);
  }

  public register(
    registerRequestDTO: RegisterRequestDTO
  ): Observable<ResponseModel<RegisterRequestDTO>> {
    const endpoint = 'auth/int/company-admin/register';
    return this.http.makeRequestWithData('post', endpoint, {}, registerRequestDTO);
  }
  public forgotPassword(
    forgotPasswordRequestDTO: ForgotPassswordDTO
  ): Observable<ResponseModel<ForgotPassswordDTO>> {
    const endpoint = 'auth/int/company-admin/login';
    return this.http.makeRequestWithData('post', endpoint, {}, forgotPasswordRequestDTO);
  }
  public resetPassword(
    resetPasswordRequestDTO: ResetPasswordDTO
  ): Observable<ResponseModel<ResetPasswordDTO>> {
    const endpoint = 'auth/int/company-admin/login';
    return this.http.makeRequestWithData('post', endpoint, {}, resetPasswordRequestDTO);
  }
}
