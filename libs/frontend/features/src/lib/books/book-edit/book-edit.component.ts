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
    const formattedDate = new Date(book.publicationDate).toISOString().split('T')[0]; // Converteer naar yyyy-MM-dd formaat
    this.bookForm = this.fb.group({
      title: [book.title, Validators.required],
      author: [book.author, Validators.required],
      description: [book.description, Validators.required],
      genre: [book.genre, Validators.required],
      publicationDate: [formattedDate, Validators.required], // Gebruik het geformatteerde formaat
    });
  }

  // Formulier verzenden
  submitForm(): void {
    if (this.bookForm.valid) {
      // Payload voorbereiden
      const updatedBook = {
        ...this.bookForm.value,
        publicationDate: new Date(this.bookForm.value.publicationDate), // Zorg dat publicationDate een Date-object is
      };
  
      console.log('Updated Book Data being sent to backend:', updatedBook); // Debugging
  
      // Verzend het boek naar de backend
      this.bookService.updateBook(this.bookId, updatedBook).subscribe({
        next: () => {
          console.log('Book updated successfully!');
          this.router.navigate(['/books']); // Redirect naar de boekenlijst
        },
        error: (err) => {
          this.errorMessage = 'Error updating book.';
          console.error(err); // Fout loggen
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
