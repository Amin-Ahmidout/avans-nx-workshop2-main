import { Injectable } from '@nestjs/common';
import { IUserInfo, UserGender, UserRole } from './user.interface';

@Injectable()
export class UserService {
  private users: IUserInfo[] = [
    {
      _id: '1',
      name: 'robin',
      emailAddress: 'r.schellius@avans.nl',
      role: UserRole.Unknown,
      gender: UserGender.Unknown,
      password: 'secret',
      isActive: true,
      profileImgUrl: 'https://randomuser.me/api/portraits/men/62.jpg',
    },
    {
      _id: '2',
      name: 'Davide',
      emailAddress: 'd.ambesi@avans.nl',
      role: UserRole.Unknown,
      gender: UserGender.Unknown,
      password: 'secret',
      isActive: true,
      profileImgUrl: 'https://randomuser.me/api/portraits/men/47.jpg',
    },
  ];

  getUsers(): IUserInfo[] {
    return this.users;
  }

  getUserById(id: string): IUserInfo | undefined {
    return this.users.find((u) => u._id === id);
  }

  updateUser(updatedUser: Partial<IUserInfo>): boolean {
    const index = this.users.findIndex((user) => user._id === updatedUser._id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser } as IUserInfo;
      return true;
    }
    return false;
  }
}
