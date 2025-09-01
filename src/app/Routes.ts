import { Routes } from '@angular/router';
import { AuthorsComponent } from './library/authors/AuthorsComponent';
import { PublishingHousesComponent } from './library/publishing-houses/PublishingHousesComponent';
import { BooksComponent } from './library/books/BooksComponent';
import { LoginComponent } from './start/login/LoginComponent';
import { NotFoundComponent } from './start/not-found/NotFoundComponent';
import { LibraryComponent } from './library/LibraryComponent';

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
