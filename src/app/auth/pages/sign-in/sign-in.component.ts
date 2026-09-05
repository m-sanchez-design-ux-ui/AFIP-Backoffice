import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

import { LoadingService } from 'app/shared/services/loading/loading.service';
import { LoginRequest } from 'app/auth/pages/sign-in/models/login-request.model';
import { NotificationsComponent } from 'app/shared/components/notifications/notifications.component';
import { NotificationsService } from 'app/shared/services/notifications/notifications.service';
import { NotificationType } from 'app/shared/interfaces/notifications-models/notification-type';
import { SignInService } from 'app/auth/services/sign-in.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NotificationsComponent,
    RouterLink,
  ],
  templateUrl: './sign-in.component.html',
  animations: [
    trigger('auth', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(650, style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition('* => void', [animate(650, style({ opacity: 0 }))]),
    ]),
  ],
})
export class SignInComponent implements OnInit {
  // NOTE (demo fork): the real Google reCAPTCHA widget was removed here.
  // It's tied to a specific verified domain, so it would break this login
  // screen the moment the app is deployed to a new domain for the demo.
  public loginForm!: FormGroup;
  public submitted = false;
  public loginError = false;
  navigateTo: string = '';

  constructor(
    private readonly notification: NotificationsService,
    private readonly loadingService: LoadingService,
    private readonly router: Router,
    private readonly signInService: SignInService
  ) {}

  ngOnInit() {
    this.navigateTo = localStorage.getItem('path') ?? '/dashboard-list';
    this.loadingService.hide();
    this.loginForm = new FormGroup({
      user: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  public onSubmit() {
    if (!this.loginForm.valid) {
      this.submitted = true;
      return;
    }

    this.loadingService.show();
    const request: LoginRequest = {
      username: this.loginForm.controls['user'].value,
      password: this.loginForm.controls['password'].value,
      gRecaptchaResponse: null,
    };

    this.signInService.login(request).subscribe({
      next: (response) => {
        this.loadingService.hide();
        localStorage.setItem(SignInService.TOKEN, response.accessToken);
        localStorage.setItem(SignInService.REFRESHTOKEN, response.refreshToken);
        this.router.navigate([this.navigateTo]);
      },
      error: (error) => {
        this.loadingService.hide();
        if (error.error.Code === 409) {
          this.loginError = true;
          return;
        }
        this.notification.show({
          data: { text: error.error.Message },
          type: NotificationType.alertDanger,
        });
      },
      complete: () => console.info('complete'),
    });
  }

  animationShow(): void {
    this.loadingService.show();
  }
}
