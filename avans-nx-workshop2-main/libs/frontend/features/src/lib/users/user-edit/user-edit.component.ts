import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Zorg dat FormGroup is geïmporteerd
import { IUserInfo, UserService } from '@avans-nx-workshop/shared/api';

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
    this.userService.getUserById(id).subscribe(user => {
      if (user) {
        this.userForm.patchValue(user); // Vul de FormGroup met gegevens van de gebruiker
      } else {
        this.errorMessage = `User with ID ${id} not found.`;
      }
    });
  }

  saveChanges(): void {
    if (this.userForm.valid) {
      const updatedUser = { _id: this.userId, ...this.userForm.value };
      this.userService.updateUser(updatedUser).subscribe(success => {
        if (success) {
          console.log('User updated successfully!');
          this.router.navigate(['/users', this.userId]);
        } else {
          console.error('Failed to update user.');
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields.';
    }
  }
  cancel(): void {
    this.router.navigate(['/users', this.userId]);
  }
}
