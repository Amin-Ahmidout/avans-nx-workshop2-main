import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserCredentials } from '@avans-nx-workshop/shared/api';
import { IUserIdentity } from '@avans-nx-workshop/shared/api';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth'; // Backend URL

    constructor(private http: HttpClient) {}

    login(credentials: IUserCredentials): Observable<IUserIdentity> {
        return this.http.post<IUserIdentity>(`${this.apiUrl}/login`, credentials);
    }

    register(user: IUserCredentials): Observable<IUserIdentity> {
        return this.http.post<IUserIdentity>(`${this.apiUrl}/register`, user);
    }
}
