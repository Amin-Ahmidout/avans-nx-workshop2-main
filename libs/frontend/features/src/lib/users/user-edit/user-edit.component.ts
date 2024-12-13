import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { IUserInfo } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'avans-nx-workshop-user-edit',
  templateUrl: './user-edit.component.html',
  styles: [],
})
export class UserEditComponent implements OnInit {
  userForm!: FormGroup;
  errorMessage: string | null = null;
  userId!: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Haal de userId uit de route parameters
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = id;

        // Laad de usergegevens en initialiseer het formulier
        this.userService.getUserById(this.userId).subscribe({
          next: (response: any) => {
            const user = response.results; // Controleer of dit klopt met je API-respons
            this.initializeForm(user);
          },
          error: (err) => {
            console.error('Error fetching user:', err);
            this.errorMessage = 'Error fetching user details.';
          },
        });
      }
    });
  }

  // Initialiseer het formulier met bestaande usergegevens
  private initializeForm(user: IUserInfo): void {
    this.userForm = this.fb.group({
      name: [user.name, Validators.required],
      emailAddress: [user.emailAddress, [Validators.required, Validators.email]],
      role: [user.role, Validators.required],
      gender: [user.gender, Validators.required],
      isActive: [user.isActive, Validators.required],
    });
  }

  // Formulier indienen
  submitForm(): void {
    if (this.userForm.valid) {
      const updatedUser = {
        _id: this.userId,
        ...this.userForm.value,
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('User updated successfully!');
          this.router.navigate(['/user/details']);
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.errorMessage = 'An error occurred while updating the user.';
        },
      });
    } else {
      this.errorMessage = 'Please fill out all required fields.';
    }
  }

  cancel(): void {
    this.router.navigate(['/user']);
  }

  deleteUser(): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.userId).subscribe({
        next: () => {
          console.log('User deleted successfully!');
          this.router.navigate(['/user/details']);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.errorMessage = 'An error occurred while deleting the user.';
        },
      });
    }
  }
}
