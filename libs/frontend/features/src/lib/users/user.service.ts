import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserInfo } from '@avans-nx-workshop/shared/api';
import { environment } from '../../../../../../libs/shared/util-env/src/lib/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.dataApiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUserInfo[]> {
    return this.http.get<IUserInfo[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${this.apiUrl}/${id}`);
  }

  updateUser(updatedUser: Partial<IUserInfo>): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${updatedUser._id}`, updatedUser);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCurrentUser(): Observable<IUserInfo> {
    const token = localStorage.getItem('token'); // Zorg dat het token correct is opgeslagen
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<IUserInfo>(`${this.apiUrl}/me`, { headers });
  }
  
}
