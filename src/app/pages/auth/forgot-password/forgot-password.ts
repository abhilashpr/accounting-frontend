import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, ButtonModule, AppFloatingConfigurator, InputTextModule, PasswordModule, RippleModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  email: string = '';
  isLoading: boolean = false;

  sendOtp() {
    // Handle the forgot password logic here
    console.log('Forgot password for email:', this.email);
  }

}
