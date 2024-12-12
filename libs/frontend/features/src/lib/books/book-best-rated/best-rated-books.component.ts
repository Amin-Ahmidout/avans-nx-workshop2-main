import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { IBook } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-best-rated-books',
  templateUrl: './best-rated-books.component.html',
  styleUrls: ['./best-rated-books.component.css']
})
export class BestRatedBooksComponent implements OnInit {
  bestRatedBooks: any[] = [];
  error: string | null = null;
  book!: IBook;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBestRatedBooks().subscribe({
      next: (response: any) => {
        this.bestRatedBooks = response.results;
        console.log('Best-rated books:', this.bestRatedBooks);
      },
      error: (err) => (this.error = 'Failed to load best-rated books.')
    });
  }
}
