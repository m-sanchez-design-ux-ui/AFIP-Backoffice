import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { JsonPipe } from '@angular/common';

import { isValidEmail } from 'app/shared/utils/isValidEmail';
import { LoadingService } from 'app/shared/services/loading/loading.service';
import { NotificationsComponent } from 'app/shared/components/notifications/notifications.component';
import { NotificationsService } from 'app/shared/services/notifications/notifications.service';
import { NotificationType } from 'app/shared/interfaces/notifications-models/notification-type';
import { SignInService } from 'app/auth/services/sign-in.service';

@Component({
  selector: 'app-password-recover',
  standalone: true,
  imports: [
    NotificationsComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './password-recover.component.html',
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
export class PasswordRecoverComponent implements OnInit {
  // NOTE (demo fork): the real Google reCAPTCHA widget was removed here,
  // same as in the login screen, since it's tied to a specific domain.
  public loginForm!: FormGroup;

  public submitted = false;
  public isValidEmail?: boolean;

  constructor(
    private readonly notification: NotificationsService,
    private readonly loadingService: LoadingService,
    private readonly signInService: SignInService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  public resetPassword() {
    const email = this.loginForm.controls['email'].value;
    if (!this.loginForm.valid && this.loginForm.controls['email'].errors !== null) {
      this.submitted = true;
      return;
    }

    if (!isValidEmail(email)) {
      this.isValidEmail = false;
      return;
    }

    const request = {
      email: email,
      gRecaptchaResponse: '',
    };

    this.loadingService.show();
    this.signInService.forgotPassword(request).subscribe({
      next: () => {
        this.notification.show({
          data: {
            text: 'Verifique su correo electrónico para recuperar el acceso a su cuenta.',
          },
          type: NotificationType.toastSuccess,
        });
        this.loadingService.hide();
      },
      error: (err) => {
        this.notification.show({
          data: { text: err.error.Message },
          type: NotificationType.toastDanger,
        });
        this.loadingService.hide();
      },
    });
  }
}
