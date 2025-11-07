import { Component, OnInit, inject, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgForm,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IAuthor } from '../library.interface';
import { LibraryService } from '../../services/library';

@Component({
  selector: 'app-authors',
  standalone: true,
  templateUrl: './authors.html',
  styleUrls: ['./authors.css'],
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
  ],
})
export class AuthorsComponent implements OnInit {
  libraryService = inject(LibraryService);
  confirmationService = inject(ConfirmationService);
  form = viewChild('form', { read: NgForm });
  visibleError = false;
  errorMessage = '';
  authors: IAuthor[] = [];
  visibleConfirm = false;
  showCustomConfirm = false;
  customConfirmMessage = '';
  private authorToDelete: IAuthor | null = null;

  author = signal<IAuthor>({
    idAuthor: 0,
    nameAuthor: '',
  });

  email: string = '';

  authorForm = new FormGroup({
    nameAuthor: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.getAuthors();
    this.email = localStorage.getItem('email') || '';
  }

  get isAdmin(): boolean {
    return this.email === 'admin@mail.com';
  }

  getAuthors() {
    this.libraryService.getAuthors().subscribe({
      next: (data: IAuthor[]) => {
        this.visibleError = false;
        this.authors = data;
      },
      error: (err: any) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  save() {
    if (this.authorForm.value.nameAuthor) {
      if (this.author().idAuthor === 0) {
        this.libraryService
          .addAuthor({
            ...this.author(),
            nameAuthor: this.authorForm.value.nameAuthor,
          })
          .subscribe({
            next: (data: IAuthor) => {
              this.visibleError = false;
              this.authorForm.reset();
              this.getAuthors();
            },
            error: (err: any) => {
              console.log(err);
              this.visibleError = true;
              this.controlError(err);
            },
          });
      } else {
        this.libraryService
          .updateAuthor({
            ...this.author(),
            nameAuthor: this.authorForm.value.nameAuthor,
          })
          .subscribe({
            next: (data: IAuthor) => {
              this.visibleError = false;
              this.cancelEdition();
              this.authorForm.reset();
              this.getAuthors();
            },
            error: (err: any) => {
              this.visibleError = true;
              this.controlError(err);
            },
          });
      }
    }
  }

  edit(author: IAuthor) {
    this.author.set({ ...author });
    this.authorForm.patchValue({ nameAuthor: author.nameAuthor });
  }

  cancelEdition() {
    this.author.set({
      idAuthor: 0,
      nameAuthor: '',
    });
    this.authorForm.reset();
  }

  confirmDelete(author: IAuthor) {
    this.customConfirmMessage = `Delete the author "${author.nameAuthor}"?`;
    this.authorToDelete = author;
    this.showCustomConfirm = true;
  }

  onCustomConfirmAccept() {
    if (this.authorToDelete) {
      this.deleteAuthor(this.authorToDelete.idAuthor!);
      this.authorToDelete = null;
    }
    this.showCustomConfirm = false;
  }

  deleteAuthor(id: number) {
    this.libraryService.deleteAuthor(id).subscribe({
      next: (data: any) => {
        this.visibleError = false;
        this.authorForm.reset();
        this.getAuthors();
      },
      error: (err: any) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  controlError(err: any) {
    if (err.error && typeof err.error === 'object' && err.error.message) {
      this.errorMessage = err.error.message;
    } else if (typeof err.error === 'string') {
      // If `err.error` is a string, it is assumed to be the error message
      this.errorMessage = err.error;
    } else {
      // Handles the case where no useful error message is received
      this.errorMessage = 'An unexpected error has occurred';
    }
  }
}
