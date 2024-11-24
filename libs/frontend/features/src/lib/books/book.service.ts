import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBook, ICreateBook } from '@avans-nx-workshop/shared/api';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:3000/api/book';

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.apiUrl);
  }

  createBook(book: ICreateBook): Observable<IBook> {
    return this.http.post<IBook>(this.apiUrl, book);
  }
}
