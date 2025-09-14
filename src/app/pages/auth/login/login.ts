import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { Auth } from '@/service/auth';
import { AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/apiResponse';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    constructor(private readonly authService: Auth) {}

    login() {
        this.authService.userLogin({ email: this.email, password: this.password }).subscribe({
            next: (res:ApiResponse<AuthResponse>) => {
                if (res.data.role === 'superadmin') {
                    
                }else{
                    
                }
            },
            error: (err) => {

            }
        })
    }
}
