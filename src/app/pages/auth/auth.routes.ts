import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';
import { Login } from './login/login';
import { ForgotPassword } from './forgot-password/forgot-password';
import { VerifyOtp } from './verify-otp/verify-otp';
import { ResetPassword } from './reset-password/reset-password';

export default [
    { path: '', component: Login },
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'forgot-password', component: ForgotPassword},
    { path: 'verify-otp', component: VerifyOtp},
    { path: 'reset-password', component: ResetPassword }
] as Routes;
