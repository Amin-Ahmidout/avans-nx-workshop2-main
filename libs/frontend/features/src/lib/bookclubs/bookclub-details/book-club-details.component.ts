import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookClubService } from '../bookclub.service';
import { BookService } from '../../books/book.service'; // Voeg de BookService toe

@Component({
    selector: 'app-book-club-detail',
    templateUrl: './book-club-details.component.html',
})
export class BookClubDetailsComponent implements OnInit {
    bookClub: any = null;
    availableBooks: any[] = []; // Lijst voor beschikbare boeken
    selectedBookId: string = ''; // Geselecteerd boek ID
    newBookId: string = '';

    constructor(
        private route: ActivatedRoute,
        private bookClubService: BookClubService,
        private bookService: BookService // Injecteer de BookService
    ) {}

    ngOnInit(): void {
        const bookClubId = this.route.snapshot.paramMap.get('id')!;
        this.bookClubService.getBookClubById(bookClubId).subscribe({
            next: (response: any) => {
                console.log('Loaded book club:', response.results); // Controleer de ontvangen data
                this.bookClub = response.results; // Haal de data uit de `results`-eigenschap
            },
            error: (err: any) => console.error('Error loading book club details:', err),
        });

        this.loadAvailableBooks();
    }

    loadAvailableBooks(search: string = ''): void {
        this.bookService.getAllBooks().subscribe({
            next: (books: any) => {
                console.log('Available books:', books);
                this.availableBooks = books.results; // Haal de data uit de `results`-eigenschap
            },
            error: (err: any) => console.error('Error loading available books:', err),
        });
    }

    addBookToClub(): void {
        if (this.selectedBookId) {
            this.bookClubService.addBookToClub(this.bookClub._id, this.selectedBookId).subscribe({
                next: (updatedClub: any) => {
                    // Voeg het nieuwe boek toe aan de lokale lijst
                    const addedBook = this.availableBooks.find(book => book._id === this.selectedBookId);
                    if (addedBook) {
                        this.bookClub.books.push(addedBook);
                    }
                    
                    // Reset de geselecteerde boek-ID
                    this.selectedBookId = '';
    
                    console.log('Book added successfully:', updatedClub);
                },
                error: (err: any) => console.error('Error adding book:', err),
            });
        }
    }
    
}
