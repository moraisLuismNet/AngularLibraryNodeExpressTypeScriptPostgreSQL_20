import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/NavbarComponent';

@Component({
  selector: 'app-library',
  standalone: true,
  templateUrl: './LibraryComponent.html',
  imports: [CommonModule, RouterModule, NavbarComponent],
})
export class LibraryComponent {}
