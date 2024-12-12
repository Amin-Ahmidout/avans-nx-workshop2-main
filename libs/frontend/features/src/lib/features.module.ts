import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { ColumnsComponent } from './columns/columns.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './users/user.service';
import { HttpClientModule } from '@angular/common/http'; 
import { AuthService } from './auth/auth.service';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookCreateComponent } from './books/book-create/book-create.component';
import { BookEditComponent } from './books/book-edit/book-edit.component';
import { FavoritesComponent } from './books/book-favourite/favorites-component';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { BookClubService } from './bookclubs/bookclub.service';
import { CreateBookClubComponent } from './bookclubs/bookclub-create/book-club-create.component';
import { BookClubListComponent } from './bookclubs/bookclub-list/book-club-list.component';
import { BookClubDetailsComponent } from './bookclubs/bookclub-details/book-club-details.component';
import { BestRatedBooksComponent } from './books/book-best-rated/best-rated-books.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule
    ],
    declarations: [
        UserDetailsComponent,
        UserListComponent,
        UserEditComponent,
        ColumnsComponent,
        BookListComponent,
        BookCreateComponent,
        BookEditComponent,
        FavoritesComponent,
        BookDetailsComponent,
        CreateBookClubComponent,
        BookClubListComponent,
        BookClubDetailsComponent,
        BestRatedBooksComponent
    ],
    providers: [
        UserService,
        AuthService,
        BookClubService
    ],
    exports: [
        BookListComponent,
        BookCreateComponent,
        BookEditComponent,
        FavoritesComponent,
        BookDetailsComponent,
        BookClubDetailsComponent,
        FormsModule,  // Voeg FormsModule toe
        ReactiveFormsModule // Voeg ReactiveFormsModule toe
    ],
})
export class FeaturesModule {}




