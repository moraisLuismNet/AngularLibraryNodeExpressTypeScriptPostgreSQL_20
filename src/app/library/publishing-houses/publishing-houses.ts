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
import { IPublishingHouse } from '../library.interface';
import { LibraryService } from '../../services/library';

@Component({
  selector: 'app-publishing-houses',
  standalone: true,
  templateUrl: './publishing-houses.html',
  styleUrls: ['./publishing-houses.css'],
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
export class PublishingHousesComponent implements OnInit {
  libraryService = inject(LibraryService);
  confirmationService = inject(ConfirmationService);
  form = viewChild('form', { read: NgForm });
  visibleError = false;
  errorMessage = '';
  publishingHouses: IPublishingHouse[] = [];
  visibleConfirm = false;
  showCustomConfirm = false;
  customConfirmMessage = '';
  private publishingHouseToDelete: IPublishingHouse | null = null;

  publishingHouse = signal<IPublishingHouse>({
    idPublishingHouse: 0,
    namePublishingHouse: '',
  });

  publishingHouseForm = new FormGroup({
    namePublishingHouse: new FormControl('', { nonNullable: true }),
  });

  email: string = '';

  ngOnInit(): void {
    this.getPublishingHouses();
    this.email = localStorage.getItem('email') || '';
  }

  get isAdmin(): boolean {
    return this.email === 'admin@mail.com';
  }

  getPublishingHouses() {
    this.libraryService.getPublishingHouses().subscribe({
      next: (data: IPublishingHouse[]) => {
        this.visibleError = false;
        this.publishingHouses = data;
      },
      error: (err: any) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  save() {
    if (this.publishingHouseForm.value.namePublishingHouse) {
      const publishingHouseData: IPublishingHouse = {
        ...this.publishingHouse(),
        namePublishingHouse: this.publishingHouseForm.value.namePublishingHouse,
      };

      if (this.publishingHouse().idPublishingHouse === 0) {
        this.libraryService
          .addPublishingHouse(publishingHouseData)
          .subscribe({
            next: (data: IPublishingHouse) => {
              this.visibleError = false;
              this.publishingHouseForm.reset();
              this.getPublishingHouses();
            },
            error: (err: any) => {
              console.log(err);
              this.visibleError = true;
              this.controlError(err);
            },
          });
      } else {
        this.libraryService
          .updatePublishingHouse(publishingHouseData)
          .subscribe({
            next: (data: IPublishingHouse) => {
              this.visibleError = false;
              this.cancelEdition();
              this.publishingHouseForm.reset();
              this.getPublishingHouses();
            },
            error: (err: any) => {
              this.visibleError = true;
              this.controlError(err);
            },
          });
      }
    }
  }

  edit(publishingHouse: IPublishingHouse) {
    this.publishingHouse.set({ ...publishingHouse });
    this.publishingHouseForm.patchValue({
      namePublishingHouse: publishingHouse.namePublishingHouse,
    });
  }

  cancelEdition() {
    this.publishingHouse.set({
      idPublishingHouse: 0,
      namePublishingHouse: '',
    });
    this.publishingHouseForm.reset();
  }

  confirmDelete(publishingHouse: IPublishingHouse) {
    this.customConfirmMessage = `Delete the publishing house "${publishingHouse.namePublishingHouse}"?`;
    this.publishingHouseToDelete = publishingHouse;
    this.showCustomConfirm = true;
  }

  onCustomConfirmAccept() {
    if (this.publishingHouseToDelete) {
      this.deletePublishingHouse(
        this.publishingHouseToDelete.idPublishingHouse!
      );
      this.publishingHouseToDelete = null;
    }
    this.showCustomConfirm = false;
  }

  deletePublishingHouse(id: number) {
    this.libraryService.deletePublishingHouse(id).subscribe({
      next: (data: any) => {
        this.visibleError = false;
        this.publishingHouseForm.reset();
        this.getPublishingHouses();
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
