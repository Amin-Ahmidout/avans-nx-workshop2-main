import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BookClubService } from "../bookclub.service";

@Component({
    selector: 'app-create-book-club',
    templateUrl: './book-club-create.component.html',
})
export class CreateBookClubComponent {
    // Explicit type for bookClub to avoid errors
    bookClub: { name: string; description: string } = { name: '', description: '' };

    constructor(private bookClubService: BookClubService, private router: Router) {}

    createBookClub(): void {
        if (!this.bookClub.name || !this.bookClub.description) {
            alert('Please fill in all fields');
            return;
        }
    
        this.bookClubService.createBookClub(this.bookClub).subscribe({
            next: () => {
                this.router.navigate(['/book-clubs']);
            },
            error: (err) => {
                console.error('Error creating book club:', err);
                alert('Failed to create book club. Please try again.');
            },
        });
    }
    
}
