import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';

@Component({
    selector: 'app-popular-books',
    templateUrl: './popular-books.component.html',
    styleUrls: ['./popular-books.component.css']
})
export class PopularBooksComponent implements OnInit {
    popularBooks: any[] = [];
    error: string | null = null;

    constructor(private bookService: BookService) {}

    ngOnInit(): void {
        this.bookService.getPopularBooks().subscribe({
            next: (response: any) => {
                this.popularBooks = response.results.slice(0, 3); // Alleen top 3 boeken
            },
            error: (err) => {
                this.error = 'Failed to load popular books.';
                console.error(err);
            }
        });
    }
}
