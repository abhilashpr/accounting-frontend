export interface LoginRequest {
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: 'superadmin' | 'admin' | 'user'; 
}

export interface VerifyAccessRequest{
    access_token: string
}

export interface VerifyAccessResponse{
    role: 'superadmin' | 'admin' | 'user';
}