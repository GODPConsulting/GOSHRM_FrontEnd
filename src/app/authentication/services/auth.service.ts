import { ForgotPassswordDTO, LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, RegisterResponseDTO, ResetPasswordDTO } from './../models/auth.model';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
// import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpService) {}

  public login(
    loginRequestDTO: LoginRequestDTO
  ): Observable<ResponseModel<LoginResponseDTO>> {
    const endpoint = '/admin/login';
    return this.http.makeRequestWithData('post', endpoint, {}, loginRequestDTO);
  }

  public register(
    registerRequestDTO: RegisterRequestDTO
  ): Observable<ResponseModel<RegisterResponseDTO>> {
    const endpoint = '/admin/signup';
    return this.http.makeRequestWithData('post', endpoint, {}, registerRequestDTO);
  }

  public registerParticipant(
    registerRequestDTO: RegisterRequestDTO
  ): Observable<ResponseModel<RegisterResponseDTO>> {
    const endpoint = '/participantsignup';
    return this.http.makeRequestWithData('post', endpoint, {}, registerRequestDTO);
  }
  public forgotPassword(
    forgotPasswordRequestDTO: ForgotPassswordDTO
  ): Observable<ResponseModel<ForgotPassswordDTO>> {
    const endpoint = '';
    return this.http.makeRequestWithData('post', endpoint, {}, forgotPasswordRequestDTO);
  }
  public resetPassword(
    resetPasswordRequestDTO: ResetPasswordDTO
  ): Observable<ResponseModel<ResetPasswordDTO>> {
    const endpoint = '';
    return this.http.makeRequestWithData('post', endpoint, {}, resetPasswordRequestDTO);
  }

  public getProfile(
  ): Observable<ResponseModel<LoginResponseDTO>> {
    const endpoint = '/fetch/profile';
    return this.http.makeRequestWithData('get', endpoint, {});
  }

  public getAllUsers(
    payload: any
  ): Observable<ResponseModel<LoginResponseDTO>> {
    const endpoint = '/allUsers';
    const params = new HttpParams()
    .set('requesterId', payload.requesterId)
    .set('createdByType', payload.createdByType)
    return this.http.getRequestWithParams( endpoint, params);
  }

  public getAllParticipants(
    companyId: number
    ): Observable<ResponseModel<any>> {
      const params = new HttpParams()
      .set('companyId', companyId);
     const endpoint = '/trainingparticipant/getTrainingParticipants';
     return this.http.getRequestWithParams(endpoint, params);
  }
}
