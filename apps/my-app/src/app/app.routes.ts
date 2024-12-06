import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { UserDetailsComponent, UserEditComponent, UserListComponent, ColumnsComponent } from '@avans-nx-workshop/features';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BookListComponent } from '../../../../libs/frontend/features/src/lib/books/book-list/book-list.component';
import { BookCreateComponent } from '../../../../libs/frontend/features/src/lib/books/book-create/book-create.component';
import { BookEditComponent } from '../../../../libs/frontend/features/src/lib/books/book-edit/book-edit.component';
import { FavoritesComponent } from '../../../../libs/frontend/features/src/lib/books/book-favourite/favorites-component';
import { BookDetailsComponent } from '../../../../libs/frontend/features/src/lib/books/book-details/book-details.component';

export const appRoutes: Route[] = [
    // Hier komen onze URLs te staan.
    { path: '', pathMatch: 'full', redirectTo: 'dashboard'}, 
    { path: 'dashboard', component: DashboardComponent },
    { path: 'about', pathMatch: 'full', component: AboutComponent },
    { path: 'users', pathMatch: 'full', component: UserListComponent },
    { path: 'users/:id', component: UserDetailsComponent },
    { path: 'users/new', component: UserEditComponent },
    { path: 'users/:id/edit', component: UserEditComponent },
    {path: 'columns',component: ColumnsComponent, children:[
        {path: ':id', component: UserDetailsComponent}
    ] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'books', component: BookListComponent },
    { path: 'books/create', component: BookCreateComponent },
    { path: 'books/:id/edit', component: BookEditComponent },
    { path: 'favorites', component: FavoritesComponent },
    {path: 'books/:id', component: BookDetailsComponent},


    




    { path: '**', redirectTo: 'dashboard'}
];
