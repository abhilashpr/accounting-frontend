import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-reset-password',
  imports: [AppFloatingConfigurator, ButtonModule, FormsModule, InputTextModule, RippleModule, CommonModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  newPassword: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  isLoading: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordMatch(): void {
    this.passwordMismatch = this.confirmPassword.length > 0 && this.newPassword !== this.confirmPassword;
  }

  isFormValid(): boolean {
    return this.newPassword.length >= 8 &&
      this.confirmPassword.length >= 8 &&
      this.newPassword === this.confirmPassword;
  }

  resetPassword(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      // Implement your password reset logic here
      console.log('Resetting password...');
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        console.log('Password reset successfully');
      }, 2000);
    }
  }
}