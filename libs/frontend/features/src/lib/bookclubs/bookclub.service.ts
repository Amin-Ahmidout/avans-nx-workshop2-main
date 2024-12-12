import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@avans-nx-workshop/shared/util-env';
import { IBook } from 'libs/shared/api/src/lib/models/book.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BookClubService {
    private apiUrl = `${environment.dataApiUrl}/book-club`;

    constructor(private http: HttpClient) {}

    // Ophalen van alle boekenclubs
    getBookClubs(): Observable<any> {
        return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    // Ophalen van details van een specifieke boekenclub
    getBookClubDetails(bookClubId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${bookClubId}`, {
            headers: this.getAuthHeaders()
        });
    }

    getBookClubById(bookClubId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${bookClubId}`, {
            headers: this.getAuthHeaders()
        });
    }

    // Boekenclub aanmaken
    createBookClub(bookClub: {
        name: string;
        description: string;
    }): Observable<any> {
        return this.http.post(this.apiUrl, bookClub, {
            headers: this.getAuthHeaders()
        });
    }

    // Lid worden van een boekenclub
    joinBookClub(bookClubId: string): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/${bookClubId}/join`,
            {},
            {
                headers: this.getAuthHeaders()
            }
        );
    }

    // Boek toevoegen aan een boekenclub
    searchBooks(search: string): Observable<IBook[]> {
        return this.http.get<IBook[]>(`${this.apiUrl}?search=${search}`, {
            headers: this.getAuthHeaders(),
        });
    }
    
    addBookToClub(bookClubId: string, bookId: string): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/${bookClubId}/add-book`,
            { bookId },
            { headers: this.getAuthHeaders() }
        );
    }
    
    deleteBookClub(bookClubId: string): Observable<void> {
        console.log('Attempting to delete book club with ID:', bookClubId);
    
        const headers = this.getAuthHeaders();
        console.log('Headers being sent:', headers);
    
        return this.http.delete<void>(`${this.apiUrl}/${bookClubId}`, {
            headers,
        });
    }
    
    

    // Helper-methode voor het ophalen van headers met authenticatie
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }
}
