import { inject, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './start/login/LoginComponent';
import { NotFoundComponent } from './start/not-found/NotFoundComponent';
import { AuthGuard } from './guards/AuthGuardService';
import { LibraryComponent } from './library/LibraryComponent';
import { AuthorsComponent } from './library/authors/AuthorsComponent';
import { PublishingHousesComponent } from './library/publishing-houses/PublishingHousesComponent';
import { BooksComponent } from './library/books/BooksComponent';

export const canActivate = (authGuard = inject(AuthGuard)) =>
  authGuard.isLoggedIn();

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'library',
    component: LibraryComponent,
    children: [
      { path: '', redirectTo: 'publishingHouses', pathMatch: 'full' },
      { path: 'publishingHouses', component: PublishingHousesComponent },
      { path: 'authors', component: AuthorsComponent },
      { path: 'books', component: BooksComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
