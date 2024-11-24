import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BookCreateComponent } from '../../../../frontend/features/src/lib/books/book-create/book-create.component';
import { BookListComponent } from '../../../../frontend/features/src/lib/books/book-list/book-list.component';

@NgModule({
  declarations: [
    BookCreateComponent,
    BookListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, // Voeg dit toe
    ReactiveFormsModule, // Voeg dit toe
  ],
  exports: [
    BookCreateComponent,
    BookListComponent,
  ],
})
export class BooksModule {}
