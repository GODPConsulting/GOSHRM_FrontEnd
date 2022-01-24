import { ForgotPassswordDTO, LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, RegisterResponseDTO, ResetPasswordDTO } from './../models/auth.model';
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
    const endpoint = '/login/add/update/login';
    return this.http.makeRequestWithData('post', endpoint, {}, loginRequestDTO);
  }

  public register(
    registerRequestDTO: RegisterRequestDTO
  ): Observable<ResponseModel<RegisterResponseDTO>> {
    const endpoint = '/signup/add/update/signup';
    return this.http.makeRequestWithData('post', endpoint, {}, registerRequestDTO);
  }
  public forgotPassword(
    forgotPasswordRequestDTO: ForgotPassswordDTO
  ): Observable<ResponseModel<ForgotPassswordDTO>> {
    const endpoint = '/forgetpassword/add/update/forgetpassword';
    return this.http.makeRequestWithData('post', endpoint, {}, forgotPasswordRequestDTO);
  }
  public resetPassword(
    resetPasswordRequestDTO: ResetPasswordDTO
  ): Observable<ResponseModel<ResetPasswordDTO>> {
    const endpoint = 'auth/int/company-admin/login';
    return this.http.makeRequestWithData('post', endpoint, {}, resetPasswordRequestDTO);
  }
}
