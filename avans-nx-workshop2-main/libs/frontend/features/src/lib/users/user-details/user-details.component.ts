import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserInfo, UserService } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'avans-nx-workshop-user-details',
  templateUrl: './user-details.component.html',
  styles: []
})
export class UserDetailsComponent implements OnInit {
  userId!: string; // Variabele om de gebruikers-ID op te slaan
  userDetails!: IUserInfo; // Variabele om de details van de gebruiker op te slaan

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    // Haal de ID uit de routeparameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = id;
        this.getUserDetails(id); // Ophalen van gebruikersdetails
      }
    });
  }
  errorMessage: string | null = null;
  // Ophalen van gebruikersdetails via de UserService
  getUserDetails(id: string): void {
    this.userService.getUsers().subscribe(users => {
      // Zoek de gebruiker met de overeenkomende ID
      const user = users.find(u => u._id === id);
      if (user) {
        this.userDetails = user;
        console.log('User details:', user);
      } else {
        this.errorMessage = `User with ID ${id} not found.`;
        console.error(`User with ID ${id} not found.`);
      }
    });
  }
}
