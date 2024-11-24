import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { IBook } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styles: [],
})
export class BookListComponent implements OnInit {
  books: IBook[] = [];
  errorMessage: string | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (err) => {
        this.errorMessage = 'Error fetching books.';
        console.error(err);
      },
    });
  }
}
