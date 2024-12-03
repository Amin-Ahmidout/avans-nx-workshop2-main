import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { IBook } from '@avans-nx-workshop/shared/api';

@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styles: []
})
export class BookListComponent implements OnInit {
    books: IBook[] = [];
    errorMessage: string | null = null;

    constructor(private bookService: BookService) {}

    ngOnInit(): void {
        this.bookService.getAllBooks().subscribe({
            next: (response: any) => {
                this.books = response.results; // Haal de boeken uit de 'results' eigenschap
                console.log('Books fetched:', this.books);
            },
            error: (err) => {
                this.errorMessage = 'Error fetching books.';
                console.error(err);
            }
        });
    }

    addToFavorites(bookId: string): void {
      const userId = localStorage.getItem('userId'); // Neem aan dat je userId opslaat na login
      console.log('UserId in localStorage:', localStorage.getItem('userId'));

      if (!userId) {
          this.errorMessage = 'You must be logged in to add books to favorites.';
          return;
      }
  
      this.bookService.addBookToFavorites(userId, bookId).subscribe({
          next: () => {
              alert('Book added to favorites!');
          },
          error: (err) => {
              if (err.status === 400) {
                  this.errorMessage = 'Book is already in favorites.';
              } else if (err.status === 404) {
                  this.errorMessage = 'Book or user not found.';
              } else {
                  this.errorMessage = 'An error occurred while adding the book to favorites.';
              }
              console.error(err);
          },
      });
  }
  
    deleteBook(id: string): void {
      if (confirm('Are you sure you want to delete this book?')) {
          this.bookService.deleteBook(id).subscribe({
              next: () => {
                  this.books = this.books.filter((book) => book.id !== id);
              },
              error: (err) => {
                  if (err.status === 401) {
                      this.errorMessage = 'You must be logged in to delete a book.';
                  } else if (err.status === 404) {
                      this.errorMessage = 'Book not found.';
                  } else {
                      this.errorMessage = 'An error occurred while deleting the book.';
                  }
                  console.error('Error details:', err); // Log voor debugging
              },
          });
      }
  }
  
}
