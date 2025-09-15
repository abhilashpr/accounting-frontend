import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { Auth } from '@/service/auth';
import { AuthResponse, VerifyAccessResponse } from '@/types/auth';
import { ApiResponse } from '@/types/apiResponse';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    constructor(
        private readonly authService: Auth,
        private readonly router: Router,
        private readonly messageService: MessageService
    ) { }
    ngOnInit() {
        this.checkTokenValidRedirect()
    }

    checkTokenValidRedirect() {
        const access_token = this.authService.getLocalAccessToken();
        if (access_token) {
            this.authService.verifyAccessToken({ access_token: access_token }).subscribe({
                next: (res: ApiResponse<VerifyAccessResponse>) => {
                    this.redirectBasedRole(res.data.role);

                }
            })

        }
    }

    onclickSignin() {
        

        this.authService.userLogin({ email: this.email, password: this.password }).subscribe({
            next: (res: ApiResponse<AuthResponse>) => {
                this.messageService.add({
                    styleClass: 'success-light-popover',
                    severity: 'Success',
                    summary: 'Success',
                    detail: 'Log in successfully',
                    life: 1000
                });
                this.redirectBasedRole(res.data.role);

            },
            error: (error: any) => {
                this.messageService.add({
                    styleClass: 'danger-light-popover',
                    severity: 'Error',
                    summary: 'Error',
                    detail: error?.error?.error,
                    life: 6000
                });
            }
        })
    }

    redirectBasedRole(role: string) {
        if (role === 'superadmin') {
            this.router.navigate(['superadmin', 'package']);
        }
        else {
            this.router.navigate(['staff', 'dashboard']);
        }

    }
}
