import {
  Component,
  OnInit,
  inject,
  viewChild,
  ElementRef,
  signal,
} from '@angular/core';
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
import { IAuthor, IBook, IPublishingHouse } from '../LibraryInterface';
import { LibraryService } from '../LibraryService';

@Component({
  selector: 'app-books',
  standalone: true,
  templateUrl: './BooksComponent.html',
  styleUrls: ['./BooksComponent.css'],
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
export class BooksComponent implements OnInit {
  libraryService = inject(LibraryService);
  confirmationService = inject(ConfirmationService);

  form = viewChild('form', { read: NgForm });
  fileInput = viewChild('fileInput', { read: ElementRef });
  visibleError = false;
  errorMessage = '';
  books: IBook[] = [];
  authors: IAuthor[] = [];
  publishingHouses: IPublishingHouse[] = [];
  visibleConfirm = false;
  urlImage = '';
  visiblePhoto = false;
  photo = '';
  showCustomConfirm = false;
  customConfirmMessage = '';
  private bookToDelete: IBook | null = null;

  book = signal<IBook>({
    isbn: 0,
    title: '',
    pages: 0,
    price: 0,
    photo: null,
    photoCover: null,
    discontinued: false,
    authorId: null,
    publishingHouseId: null,
  });

  email: string = '';

  bookForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    pages: new FormControl(0, { nonNullable: true }),
    price: new FormControl(0, { nonNullable: true }),
    discontinued: new FormControl(false, { nonNullable: true }),
    publishingHouseId: new FormControl<number | null>(null),
    authorId: new FormControl<number | null>(null),
    photoName: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.getAuthors();
    this.getPublishinHouses();
    this.getBooks();
    this.email = localStorage.getItem('email') || '';
  }

  get isAdmin(): boolean {
    return this.email === 'admin@mail.com';
  }

  getAuthors() {
    this.libraryService.getAuthors().subscribe({
      next: (data) => {
        this.visibleError = false;
        this.authors = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  getPublishinHouses() {
    this.libraryService.getPublishingHouses().subscribe({
      next: (data) => {
        this.visibleError = false;
        this.publishingHouses = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  getBooks() {
    this.libraryService.getBooks().subscribe({
      next: (data) => {
        this.visibleError = false;
        this.books = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  onChange(event: any) {
    const file = event.target.files;

    if (file && file.length > 0) {
      this.book.update((b) => ({
        ...b,
        photo: file[0],
        photoName: file[0].name,
      }));
    }
  }

  onAcept() {
    // After processing the selected file, delete its contents from the input
    (this.fileInput()?.nativeElement as HTMLInputElement).value = '';
  }

  showImage(book: IBook) {
    if (this.visiblePhoto && this.book().isbn === book.isbn) {
      this.visiblePhoto = false;
    } else {
      this.book.set(book);
      this.photo = book.photoCover
        ? 'http://localhost:3000/uploads/' + book.photoCover
        : '';
      this.visiblePhoto = true;
    }
  }
  save() {
    if (this.bookForm.valid) {
      if (!this.bookForm.value.authorId) {
        alert('Debes seleccionar un autor');
        return;
      }
      if (this.book().isbn === 0) {
        this.libraryService
          .addBook({
            ...this.book(),
            ...this.bookForm.value,
          })
          .subscribe({
            next: (data) => {
              this.visibleError = false;
              this.bookForm.reset();
              this.getBooks();
            },
            error: (err) => {
              console.log(err);
              this.visibleError = true;
              this.controlError(err);
            },
          });
      } else {
        this.libraryService
          .updateBook({
            ...this.book(),
            ...this.bookForm.value,
          })
          .subscribe({
            next: (data) => {
              this.visibleError = false;
              this.cancelEdition();
              this.bookForm.reset();
              this.getBooks();
            },
            error: (err) => {
              this.visibleError = true;
              this.controlError(err);
            },
          });
      }
    }
  }

  confirmDelete(book: IBook) {
    this.customConfirmMessage = `Delete the book "${book.title}"?`;
    this.bookToDelete = book;
    this.showCustomConfirm = true;
  }

  onCustomConfirmAccept() {
    if (this.bookToDelete) {
      this.deleteBook(this.bookToDelete.isbn);
      this.bookToDelete = null;
    }
    this.showCustomConfirm = false;
  }

  deleteBook(id: number) {
    this.libraryService.deleteBook(id).subscribe({
      next: (data: IBook) => {
        this.visibleError = false;
        this.getBooks();
      },
      error: (err: any) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  edit(book: IBook) {
    this.book.set({
      ...book,
      publishingHouseId: book.publishingHouseId ?? null,
      authorId: book.authorId ?? null,
      photoName: book.photoCover ? this.extractNameImage(book.photoCover) : '',
    });
    this.bookForm.patchValue({
      title: book.title,
      pages: book.pages,
      price: book.price,
      discontinued: book.discontinued,
      publishingHouseId:
        typeof book.publishingHouseId === 'number'
          ? book.publishingHouseId
          : (null as null),
      authorId:
        typeof book.authorId === 'number' ? book.authorId : (null as null),
      photoName: book.photoName || '',
    });
  }

  extractNameImage(url: string): string {
    return url.split('/').pop() || ''; // Extract image name from URL
  }

  cancelEdition() {
    this.book.set({
      isbn: 0,
      title: '',
      pages: 0,
      price: 0,
      discontinued: false,
      authorId: 0,
      publishingHouseId: 0,
      photo: null,
      photoCover: null,
    });
    this.bookForm.reset();
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
  getAuthorName(authorId: number | null): string {
    const author = this.authors.find((a) => a.idAuthor === authorId);
    return author ? author.nameAuthor : '';
  }
  getPublishingHouseName(publishingHouseId: number | null): string {
    const publishingHouse = this.publishingHouses.find(
      (a) => a.idPublishingHouse === publishingHouseId
    );
    return publishingHouse ? publishingHouse.namePublishingHouse : '';
  }
}
