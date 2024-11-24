import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserInfo } from '@avans-nx-workshop/shared/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user'; 

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
}
