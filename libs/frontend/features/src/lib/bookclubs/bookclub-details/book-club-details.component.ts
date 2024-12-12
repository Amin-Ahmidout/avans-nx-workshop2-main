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
    userId: string = localStorage.getItem('userId') || ''; // Haal de ingelogde gebruiker op

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
                    const addedBook = this.availableBooks.find(book => book._id === this.selectedBookId);
                    if (addedBook) {
                        this.bookClub.books.push(addedBook);
                    }
                    this.selectedBookId = '';
                    console.log('Book added successfully:', updatedClub);
                },
                error: (err: any) => {
                    console.error('Error adding book:', err);
                    alert('You are not authorized to add books to this club.');
                },
            });
        }
    }
    
    removeBookFromClub(bookId: string): void {
        if (confirm('Are you sure you want to remove this book from the club?')) {
            this.bookClubService.removeBookFromClub(this.bookClub._id, bookId).subscribe({
                next: (updatedClub: any) => {
                    this.bookClub.books = this.bookClub.books.filter(
                        (book: any) => book._id !== bookId
                    );
                    console.log('Book removed successfully:', updatedClub);
                },
                error: (err: any) => {
                    console.error('Error removing book:', err);
                    alert('You are not authorized to remove books from this club.');
                },
            });
        }
    }
    

    editBookClub(): void {
        const updatedData = {
            name: this.bookClub.name,
            description: this.bookClub.description,
        };
    
        this.bookClubService.editBookClub(this.bookClub._id, updatedData).subscribe({
            next: (updatedClub: any) => {
                alert('Book club updated successfully!');
                this.bookClub = { ...this.bookClub, ...updatedClub }; // Gebruik een nieuw object
                console.log('Updated book club data:', updatedClub);
            },
            error: (err: any) => {
                console.error('Error updating book club:', err);
                alert('Failed to update the book club. Please try again.');
            },
        });
    }
    
    
    
    
    isOwner(ownerId: string): boolean {
        return this.userId === ownerId; // Controleer of de ingelogde gebruiker de eigenaar is
    }
    
}
