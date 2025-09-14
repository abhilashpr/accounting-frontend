import { ApiResponse } from '@/types/apiResponse';
import { AuthResponse, ForgotPasswordRequest, LoginRequest, ResetPasswordRequest, VerifyOtpRequest } from '@/types/auth';
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

  getLocalRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setTokenData(data: AuthResponse) {
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
  }

  userLogin(data: LoginRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}login`, data).pipe(
      tap((res) => this.setTokenData(res.data))
    )
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
