import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBook, ICreateBook } from '@avans-nx-workshop/shared/api';
import { environment } from '../../../../../../libs/shared/util-env/src/lib/environment';
import { Review } from 'libs/backend/features/src/lib/book/book.schema';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = `${environment.dataApiUrl}/book`;
    private rcmndApiUrl = `${environment.rcmndApiUrl}`;

    constructor(private http: HttpClient) {}

    getAllBooks(): Observable<IBook[]> {
        return this.http.get<IBook[]>(this.apiUrl, {
            headers: this.getAuthHeaders()
        });
    }

    createBook(book: ICreateBook): Observable<IBook> {
        return this.http.post<IBook>(this.apiUrl, book, {
            headers: this.getAuthHeaders()
        });
    }

    deleteBook(id: string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
    }

    updateBook(id: string, book: Partial<IBook>): Observable<IBook> {
        return this.http.put<IBook>(`${this.apiUrl}/${id}`, book, {
            headers: this.getAuthHeaders()
        });
    }

    getBookById(id: string): Observable<IBook> {
        return this.http.get<IBook>(`${this.apiUrl}/${id}`, {
            headers: this.getAuthHeaders()
        });
    }

    addBookToFavorites(userId: string, bookId: string): Observable<void> {
        const url = `${environment.dataApiUrl}/user/${userId}/favorites`;
        return this.http.post<void>(
            url,
            { bookId },
            { headers: this.getAuthHeaders() }
        );
    }

    getFavorites(userId: string): Observable<IBook[]> {
        const url = `${environment.dataApiUrl}/user/${userId}/favorites`;
        return this.http.get<IBook[]>(url, { headers: this.getAuthHeaders() });
    }

    addReview(bookId: string, review: { comment: string; rating: number }): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${bookId}/reviews`, review, {
            headers: this.getAuthHeaders()
        });
    }
    
    getReviews(bookId: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/${bookId}/reviews`, {
            headers: this.getAuthHeaders()
        });
    }
    
    searchBooks(query: string): Observable<IBook[]> {
        const url = `${this.apiUrl}/search`; // Zorg ervoor dat je backend een endpoint ondersteunt zoals `/search`
        return this.http.get<IBook[]>(url, {
            headers: this.getAuthHeaders(),
            params: { query } // Voeg de zoekparameter toe
        });
    }
    
    getBestRatedBooks(): Observable<any[]> {
        const url = `${this.rcmndApiUrl}/rcmnd/best-rated`; // Zorg dat `apiBaseUrl` klopt
        return this.http.get<any[]>(url, { headers: this.getAuthHeaders() });
    }
    
    getPopularBooks(): Observable<any[]> {
        const url = `${this.rcmndApiUrl}/rcmnd/popular`;
        return this.http.get<any[]>(url, { headers: this.getAuthHeaders() });
    }
    
    
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token'); // Haal de token uit localStorage
        return new HttpHeaders({
            Authorization: `Bearer ${token}` // Voeg de token toe aan de Authorization-header
        });
    }
}
