import { Component, OnInit } from '@angular/core';
import { IUserInfo } from '@avans-nx-workshop/shared/api';
import { UserService } from '../user.service';

@Component({
  selector: 'avans-nx-workshop-user-details',
  templateUrl: './user-details.component.html',
  styles: []
})
export class UserDetailsComponent implements OnInit {
  userDetails: IUserInfo | null = null; // Variabele om gebruikersdetails op te slaan
  errorMessage: string | null = null; // Voor eventuele foutmeldingen

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Haal de details van de ingelogde gebruiker op
    this.getCurrentUserDetails();
  }

  // Ophalen van de gegevens van de ingelogde gebruiker
  getCurrentUserDetails(): void {
    this.userService.getCurrentUser().subscribe({
      next: (response: any) => {
        this.userDetails = response.results;
        console.log('Loaded user details:', response.results);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user details.';
        console.error(this.errorMessage, err);
      }
    });
  }
}
