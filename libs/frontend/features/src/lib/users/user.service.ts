import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IUserInfo {
  _id: string;
  name: string;
  emailAddress: string;
  role: string;
  gender?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = '/api/user'; // Pas dit aan op basis van je backend API endpoint.

  constructor(private http: HttpClient) {}

  /**
   * Haal alle gebruikers op
   */
  getUsers(): Observable<IUserInfo[]> {
    return this.http.get<IUserInfo[]>(this.apiUrl);
  }

  /**
   * Haal een gebruiker op met een specifieke ID
   * @param id De ID van de gebruiker
   */
  getUserById(id: string): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update een gebruiker met een specifieke ID
   * @param user De gegevens van de gebruiker die geüpdatet moeten worden
   */
  updateUser(user: Partial<IUserInfo>): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${user._id}`, user);
  }

  /**
   * Maak een nieuwe gebruiker
   * @param user De gegevens van de nieuwe gebruiker
   */
  createUser(user: IUserInfo): Observable<IUserInfo> {
    return this.http.post<IUserInfo>(this.apiUrl, user);
  }

  /**
   * Verwijder een gebruiker met een specifieke ID
   * @param id De ID van de gebruiker die verwijderd moet worden
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
