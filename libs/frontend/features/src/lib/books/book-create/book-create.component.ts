import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styles: [],
})
export class BookCreateComponent implements OnInit {
  bookForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      genre: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.bookForm.valid) {
      this.bookService.createBook(this.bookForm.value).subscribe({
        next: () => this.router.navigate(['/books']),
        error: (err) => {
          this.errorMessage = 'Error creating book.';
          console.error(err);
        },
      });
    } else {
      this.errorMessage = 'Please fill out all required fields.';
    }
  }
}
