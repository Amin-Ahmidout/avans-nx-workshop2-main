import { Injectable } from '@angular/core';
import { IUserInfo, UserGender, UserRole } from './user.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: IUserInfo[] = [
    {
      _id: "1",
      name: "robin",
      emailAddress: "r.schellius@avans.nl",
      role: UserRole.Unknown,
      gender: UserGender.Unknown,
      password: "secret",
      isActive: true,
      profileImgUrl: "https://randomuser.me/api/portraits/men/62.jpg"
    },
    {
      _id: "2",
      name: "Davide",
      emailAddress: "d.ambesi@avans.nl",
      role: UserRole.Unknown,
      gender: UserGender.Unknown,
      password: "secret",
      isActive: true,
      profileImgUrl: "https://randomuser.me/api/portraits/men/47.jpg"
    }
  ];

  // Methode om gebruikers op te halen
  getUsers(): Observable<IUserInfo[]> {
    return of(this.users); 
  }

  // Methode om één gebruiker op te halen op basis van ID
  getUserById(id: string): Observable<IUserInfo | undefined> {
    const user = this.users.find(u => u._id === id);
    return of(user);
  }

  // Methode om een gebruiker te updaten
  updateUser(updatedUser: Partial<IUserInfo>): Observable<boolean> {
    const index = this.users.findIndex(user => user._id === updatedUser._id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser } as IUserInfo;
      console.log('Updated user:', this.users[index]);
      return of(true);
    }
    console.error(`User with ID ${updatedUser._id} not found.`);
    return of(false);
  }
}
