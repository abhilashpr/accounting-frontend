import { ApiResponse } from '@/types/apiResponse';
import { AuthResponse, ForgotPasswordRequest, LoginRequest, ResetPasswordRequest, VerifyAccessRequest, VerifyAccessResponse, VerifyOtpRequest } from '@/types/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly baseUrl = environment.baseApiUrl;

  constructor(private readonly http: HttpClient) { }

  getLocalAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getLocalRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  getUserRole() {
    return localStorage.getItem('role');
  }

  setTokenData(data: AuthResponse) {
    localStorage.setItem('role', data.role);
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
  }

  userLogin(data: LoginRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}auth/login`, data).pipe(
      tap((res) => this.setTokenData(res.data))
    )
  }

  verifyAccessToken(tokenData: VerifyAccessRequest) {
    return this.http.post<ApiResponse<VerifyAccessResponse>>(`${this.baseUrl}auth/verify-access-token`, tokenData);
  }
  forgotPassword(data: ForgotPasswordRequest) {
    return this.http.post(`${this.baseUrl}forgot-password`, data);
  }

  verifyOtp(data: VerifyOtpRequest) {
    return this.http.post(`${this.baseUrl}verify-otp`, data);
  }

  resetPassword(data: ResetPasswordRequest) {
    return this.http.post(`${this.baseUrl}reset-password`, data);
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.baseUrl}refresh-token`, { refreshToken });
  }


}
