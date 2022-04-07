import { ForgotPassswordDTO, LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, RegisterResponseDTO, ResetPasswordDTO } from './../models/auth.model';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
// import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpService) {}

  public login(
    loginRequestDTO: LoginRequestDTO
  ): Observable<ResponseModel<LoginResponseDTO>> {
    const endpoint = '/lms/login';
    return this.http.makeRequestWithData('post', endpoint, {}, loginRequestDTO);
  }

  public registerProvider(
    registerRequestDTO: RegisterRequestDTO
  ): Observable<ResponseModel<RegisterResponseDTO>> {
    const endpoint = '/lms/signup';
    return this.http.makeRequestWithData('post', endpoint, {}, registerRequestDTO);
  }

  public registerParticipant(
    registerRequestDTO: RegisterRequestDTO
  ): Observable<ResponseModel<RegisterResponseDTO>> {
    const endpoint = '/lms/participantsignup';
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

  public getProfile(
  ): Observable<ResponseModel<LoginResponseDTO>> {
    // const headers: HttpHeaders = new HttpHeaders({
    //   // headers['Authorization'] = `Bearer `;
    // })
    const endpoint = '/lms/fetch/profile';
    return this.http.makeRequestWithData('get', endpoint, {});
  }
}
