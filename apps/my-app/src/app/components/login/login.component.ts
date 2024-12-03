import { Component } from '@angular/core';
import { AuthService } from '../../../../../../libs/frontend/features/src/lib/auth/auth.service';
import { IUserCredentials } from '@avans-nx-workshop/shared/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent {
    credentials: IUserCredentials = { emailAddress: '', password: '' };
    errorMessage: string | null = null;

    constructor(private authService: AuthService, private router: Router) {}

    login(): void {
        this.authService.login(this.credentials).subscribe({
            next: (response: any) => {
                const user = response.results; 
                console.log('Login response:', user);

                if (user.token) {
                    localStorage.setItem('token', user.token);
                    localStorage.setItem('userId', user._id);
                    this.router.navigate(['/']);
                } else {
                    console.error('No token returned from login.');
                    this.errorMessage = 'Login failed. Please try again.';
                }
            },
            error: (err) => {
                this.errorMessage = 'Invalid email or password';
                console.error('Login error', err);
            }
        });
    }
    
}
