import { Routes } from '@angular/router';
import { AuthorsComponent } from './library/authors/authors';
import { PublishingHousesComponent } from './library/publishing-houses/publishing-houses';
import { BooksComponent } from './library/books/books';
import { LoginComponent } from './start/login/login';
import { NotFoundComponent } from './start/not-found/not-found';
import { LibraryComponent } from './library/library';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'library',
    component: LibraryComponent,
    children: [
      { path: 'authors', component: AuthorsComponent },
      { path: 'publishingHouses', component: PublishingHousesComponent },
      { path: 'books', component: BooksComponent },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
