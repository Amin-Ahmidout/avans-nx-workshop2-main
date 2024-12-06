import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { IBook } from '@avans-nx-workshop/shared/api';
import { Review } from 'libs/backend/features/src/lib/book/book.schema';

@Component({
    selector: 'app-book-details',
    templateUrl: './book-details.component.html',
    styles: []
})
export class BookDetailsComponent implements OnInit {
    book!: IBook;
    reviews: Review[] = [];
    review = { comment: '', rating: 0 };
    errorMessage: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService
    ) {}

    ngOnInit(): void {
        const bookId = this.route.snapshot.paramMap.get('id')!;
        this.loadBookDetails(bookId);
        this.loadReviews(bookId);
    }

    loadBookDetails(bookId: string): void {
        this.bookService.getBookById(bookId).subscribe({
            next: (response: any) => {
                console.log('Book details:', response);
                this.book = response.results; // Haal de data uit de `results`-eigenschap
            },
            error: (err) => {
                this.errorMessage = 'Error loading book details.';
                console.error(err);
            },
        });
    }
    

    loadReviews(bookId: string): void {
        console.log('Calling loadReviews for bookId:', bookId);
        this.bookService.getReviews(bookId).subscribe({
            next: (response: any) => {
                console.log('Reviews loaded:', response);
                this.reviews = response.results; // Haal de data uit de `results`-eigenschap
                console.log('Parsed reviews:', this.reviews);
            },
            error: (err) => {
                this.errorMessage = 'Error loading reviews.';
                console.error('Error in loadReviews:', err);
            },
        });
    }
    

    submitReview(): void {
        const bookId = this.route.snapshot.paramMap.get('id')!;
        console.log('Submitting review for bookId:', bookId);
        console.log('Review data:', this.review);

        this.bookService.addReview(bookId, this.review).subscribe({
            next: () => {
                console.log('Review submitted successfully');
                this.review = { comment: '', rating: 0 }; // Reset the form
                this.loadReviews(bookId); // Refresh reviews
            },
            error: (err) => {
                this.errorMessage = 'Error submitting review.';
                console.error('Error in submitReview:', err);
            },
        });
    }
}
