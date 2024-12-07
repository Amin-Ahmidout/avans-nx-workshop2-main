import { Component, OnInit } from "@angular/core";
import { BookClubService } from "../bookclub.service";

@Component({
    selector: 'app-book-club-list',
    templateUrl: './book-club-list.component.html',
})
export class BookClubListComponent implements OnInit {
    bookClubs: any[] = [];

    constructor(private bookClubService: BookClubService) {}

    ngOnInit(): void {
        this.bookClubService.getBookClubs().subscribe({
            next: (response: any) => {
                this.bookClubs = response.results; // Haal de data uit de `results`-eigenschap
                console.log('Loaded book clubs:', this.bookClubs); // Log de geladen book clubs
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
                console.log(`Joined book club with ID: ${bookClubId}`); // Log de bookclub ID
            },
            error: (err) => {
                console.error('Error joining book club:', err);
            },
        });
    }
}