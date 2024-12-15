import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { IBook } from '@avans-nx-workshop/shared/api';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites-component.html',
    styleUrls: ['./favorites-component.css']
})
export class FavoritesComponent implements OnInit {
    favorites: IBook[] = [];

    constructor(private bookService: BookService) {}

    ngOnInit(): void {
        const userId = localStorage.getItem('userId'); // Neem aan dat je userId opslaat na login
        if (userId) {
            this.bookService.getFavorites(userId).subscribe({
                next: (response: any) => {
                    console.log('Response from API:', response.results);
                    this.favorites = response.results; // Gebruik 'response.results' voor de boekenlijst
                },
                error: (err: any) => {
                    console.error('Error fetching favorites:', err);
                }
            });
            
        }
    }
}
