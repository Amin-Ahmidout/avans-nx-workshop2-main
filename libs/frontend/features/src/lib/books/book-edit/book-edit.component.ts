import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../book.service';
import { IBook } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styles: [],
})
export class BookEditComponent implements OnInit {
  bookForm!: FormGroup;
  errorMessage: string | null = null;
  bookId!: string;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Haal het boek-ID uit de URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.bookId = id;

        // Laad boekgegevens en vul het formulier
        this.bookService.getBookById(this.bookId).subscribe({
            next: (response: any) => {
              console.log('Book fetched from API:', response);
              this.initializeForm(response.results); // Controleer of `results` correct is
            },
            error: (err) => {
              console.error('Error fetching book:', err);
            },
          });
      }
    });
  }

  // Initialiseer het formulier met bestaande boekgegevens
  private initializeForm(book: IBook): void {
    this.bookForm = this.fb.group({
      title: [book.title, Validators.required],
      author: [book.author, Validators.required],
      description: [book.description, Validators.required],
      genre: [book.genre, Validators.required],
      publicationYear: [book.publicationYear, Validators.required], // Gebruik het geformatteerde formaat
    });
  }

  // Formulier verzenden
  submitForm(): void {
    if (this.bookForm.valid) {
        const updatedBook = {
            ...this.bookForm.value,
            publicationYear: this.bookForm.value.publicationYear.toString(),
        };

        this.bookService.updateBook(this.bookId, updatedBook).subscribe({
            next: () => {
                console.log('Book updated successfully!');
                this.router.navigate(['/books']);
            },
            error: (err) => {
                if (err.status === 403) {
                    this.errorMessage = 'You are not authorized to update this book.';
                } else if (err.status === 404) {
                    this.errorMessage = 'Book not found.';
                } else {
                    this.errorMessage = 'An error occurred while updating the book.';
                }
                console.error('Error details:', err);
            },
        });
    } else {
        this.errorMessage = 'Please fill out all required fields.';
    }
}

  
  
  

  cancel(): void {
    this.router.navigate(['/books']);
  }
}
