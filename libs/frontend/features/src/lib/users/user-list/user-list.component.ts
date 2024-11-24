import { Component, OnInit } from '@angular/core';
import { IUserInfo } from "@avans-nx-workshop/shared/api";
import { UserService } from '../user.service';

@Component({
  selector: 'avans-nx-workshop-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: IUserInfo[] = []; // Houd hier de gebruikers bij

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        // Controleer of de data een object is met een 'results'-eigenschap
        if (response.results) {
          this.users = response.results; // Gebruik de array uit 'results'
        } else if (Array.isArray(response)) {
          this.users = response; // Als het een array is, gebruik het direct
        } else {
          console.error('Unexpected API response format:', response);
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }
}
