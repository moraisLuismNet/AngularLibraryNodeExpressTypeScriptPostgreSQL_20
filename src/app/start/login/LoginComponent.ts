import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/AppService';
import { AuthGuard } from 'src/app/guards/AuthGuardService';
import { ILogin } from 'src/app/library/interfaces/LoginInterface';
import { environment } from 'src/environments/Environment';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './LoginComponent.html',
  styleUrls: ['./LoginComponent.css'],
  providers: [MessageService],
  imports: [CommonModule, FormsModule, ToastModule, RouterModule],
})
export class LoginComponent implements OnInit {
  router = inject(Router);
  appService = inject(AppService);
  messageService = inject(MessageService);
  authGuard = inject(AuthGuard);

  infoLogin: ILogin = {
    email: '',
    password: '',
  };

  ngOnInit() {
    if (this.authGuard.isLoggedIn()) {
      this.router.navigateByUrl('library/publishingHouses');
    }
  }

  login() {
    this.appService.login(this.infoLogin).subscribe({
      next: (data) => {
        sessionStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('email', this.infoLogin.email); // Save email only on successful login
        this.router.navigateByUrl('library/publishingHouses');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Wrong credentials',
        });
      },
    });
  }

  onEmailChange(newEmail: string) {
    localStorage.setItem('email', newEmail);
  }
}
