import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { ColumnsComponent } from './columns/columns.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './users/user.service';
import { HttpClientModule } from '@angular/common/http'; 
import { AuthService } from './auth/auth.service';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookCreateComponent } from './books/book-create/book-create.component';
import { BookEditComponent } from './books/book-edit/book-edit.component';
import { FavoritesComponent } from './books/book-favourite/favorites-component';

@NgModule({
    imports: [CommonModule, RouterModule,ReactiveFormsModule, HttpClientModule  ],
    declarations: [
        UserDetailsComponent,
        UserListComponent,
        UserEditComponent,
        ColumnsComponent,
        BookListComponent,
        BookCreateComponent,
        BookEditComponent,
        FavoritesComponent
    ],
    providers:[
        UserService,
        AuthService
    ],
    exports: [
        // Exporteer de componenten zodat ze elders gebruikt kunnen worden
        BookListComponent,
        BookCreateComponent,
        BookEditComponent,
        FavoritesComponent
      ],
})
export class FeaturesModule {}



