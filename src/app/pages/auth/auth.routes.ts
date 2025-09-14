import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';
import { Login } from './login/login';
import { ForgotPassword } from './forgot-password/forgot-password';
import { VerifyOtp } from './verify-otp/verify-otp';
import { ResetPassword } from './reset-password/reset-password';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'forgot-password', component: ForgotPassword},
    { path: 'verify-otp', component: VerifyOtp},
    { path: 'reset-password', component: ResetPassword }
] as Routes;
