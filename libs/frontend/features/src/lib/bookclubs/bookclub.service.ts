import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@avans-nx-workshop/shared/util-env";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class BookClubService {
    private apiUrl = `${environment.dataApiUrl}/book-club`;

    constructor(private http: HttpClient) {}

    getBookClubs(): Observable<any> {
        return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
    }
    
    createBookClub(bookClub: { name: string; description: string }): Observable<any> {
        return this.http.post(this.apiUrl, bookClub, { headers: this.getAuthHeaders() });
    }
    

    joinBookClub(bookClubId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${bookClubId}/join`, {}, { headers: this.getAuthHeaders() });
    }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }
}
