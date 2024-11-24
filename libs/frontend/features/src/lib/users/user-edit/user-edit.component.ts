import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Zorg dat FormGroup is geïmporteerd
import { IUserInfo } from '@avans-nx-workshop/shared/api';
import { UserService } from '../user.service';

@Component({
  selector: 'avans-nx-workshop-user-edit',
  templateUrl: './user-edit.component.html',
  styles: []
})
export class UserEditComponent implements OnInit {
  userId!: string;
  userForm!: FormGroup; // Reactieve FormGroup
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder // FormBuilder voor het maken van de FormGroup
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = id;
        this.initializeForm(); // Zorg dat dit wordt aangeroepen
        this.loadUserDetails(id);
      }
    });
  }

  // Initialiseer de FormGroup
  initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      role: [''],
      gender: [''],
      isActive: [false]
    });
  }

  // Laad gebruikersgegevens en vul het formulier
  loadUserDetails(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (response: any) => {
        const user = response.results; // Haal de gebruiker uit de 'results'-eigenschap
        console.log('Fetched User:', user);
        if (user) {
          this.userForm.patchValue(user); // Vul het formulier met de data
        } else {
          this.errorMessage = `User with ID ${id} not found.`;
          console.error(this.errorMessage);
        }
      },
      error: (err) => {
        this.errorMessage = 'Error fetching user details.';
        console.error(this.errorMessage, err);
      }
    });
  }
  

  saveChanges(): void {
    if (this.userForm.valid) {
      const updatedUser = { _id: this.userId, ...this.userForm.value };
      console.log('Submitting updated user:', updatedUser);
  
      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          if (response) {
            console.log('User updated successfully!');
            this.router.navigate(['/users', this.userId]);
          } else {
            console.error('Update failed. No changes made.');
            this.errorMessage = 'Failed to update user. Please try again.';
          }
        },
        error: (err) => {
          this.errorMessage = 'Error updating user.';
          console.error(this.errorMessage, err);
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields.';
      console.error(this.errorMessage);
    }
  }
  
  cancel(): void {
    this.router.navigate(['/users', this.userId]);
  }
}
