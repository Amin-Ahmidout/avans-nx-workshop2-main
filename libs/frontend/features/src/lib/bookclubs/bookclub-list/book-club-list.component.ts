import { Component, OnInit } from "@angular/core";
import { BookClubService } from "../bookclub.service";

@Component({
    selector: 'app-book-club-list',
    templateUrl: './book-club-list.component.html',
})
export class BookClubListComponent implements OnInit {
    bookClubs: any[] = [];
    userId: string = ''; // De ingelogde gebruiker

    constructor(private bookClubService: BookClubService) {}

    ngOnInit(): void {
        this.userId = localStorage.getItem('userId') || ''; // Haal de ingelogde gebruiker op
        this.bookClubService.getBookClubs().subscribe({
            next: (response: any) => {
                this.bookClubs = response.results;
            },
            error: (err) => {
                console.error('Error loading book clubs:', err);
            },
        });
    }

    joinBookClub(bookClubId: string): void {
        this.bookClubService.joinBookClub(bookClubId).subscribe({
            next: () => {
                alert('Successfully joined the book club!');
            },
            error: (err) => {
                console.error('Error joining book club:', err);
            },
        });
    }

    deleteBookClub(bookClubId: string): void {
        if (confirm('Are you sure you want to delete this book club?')) {
            this.bookClubService.deleteBookClub(bookClubId).subscribe({
                next: () => {
                    alert('Book club deleted successfully!');
                    this.bookClubs = this.bookClubs.filter(
                        (club) => club._id !== bookClubId
                    );
                },
                error: (err) => {
                    console.error('Error deleting book club:', err);
                },
            });
        }
    }

    
    

    isOwner(ownerId: string): boolean {
        return this.userId === ownerId; // Controleer of de ingelogde gebruiker de eigenaar is
    }
}
