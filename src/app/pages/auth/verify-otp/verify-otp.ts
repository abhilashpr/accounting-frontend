import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-verify-otp',
  imports: [FormsModule, ButtonModule, AppFloatingConfigurator, InputTextModule, PasswordModule,RouterModule],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.scss'
})
export class VerifyOtp {
  email: string = '';
  otp: string = '';
  isLoading: boolean = false;
  verifyOtp(){

  }
  resendOtp(){}
}
