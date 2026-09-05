import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { JsonPipe } from '@angular/common';

import { IResetPasswordRequest } from 'app/auth/interfaces/reset-password.interface';
import { LoadingService } from 'app/shared/services/loading/loading.service';
import { MustMatch } from 'app/shared/services/form-validator.service';
import { NotificationsComponent } from 'app/shared/components/notifications/notifications.component';
import { NotificationsService } from 'app/shared/services/notifications/notifications.service';
import { NotificationType } from 'app/shared/interfaces/notifications-models/notification-type';
import { SignInService } from 'app/auth/services/sign-in.service';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NotificationsComponent,
    JsonPipe,
  ],
  templateUrl: './password-change.component.html',
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
export class PasswordChangeComponent implements OnInit, OnDestroy {
  // NOTE (demo fork): the real Google reCAPTCHA widget was removed here,
  // same as in the login screen, since it's tied to a specific domain.
  public changePasswordForm!: FormGroup;
  private subscription!: Subscription;
  private token!: string;
  private username!: string;
  public submitted = false;

  constructor(
    private readonly notification: NotificationsService,
    private readonly loadingService: LoadingService,
    private readonly signInService: SignInService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe((params: Params) => {
      this.token = params['token'];
      this.username = params['userName'];
    });

    this.changePasswordForm = this.formBuilder.group(
      {
        password: this.formBuilder.control('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            '^(?=.*[0-9])?(?=.*[a-zA-Z])?(?=.*[!?@#$%^&*()_+])?[a-zA-Z0-9!?@#$%^&*()_+]+$'
          ),
        ]),
        passwordRepeat: this.formBuilder.control('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            '^(?=.*[0-9])?(?=.*[a-zA-Z])?(?=.*[!?@#$%^&*()_+])?[a-zA-Z0-9!?@#$%^&*()_+]+$'
          ),
        ]),
      },
      {
        validators: [MustMatch('password', 'passwordRepeat')],
      }
    );
  }

  public changePassword() {
    this.loadingService.show();
    if (
      !this.changePasswordForm.valid &&
      (this.changePasswordForm.controls['password'].errors !== null ||
        this.changePasswordForm.controls['passwordRepeat'].errors !== null)
    ) {
      this.submitted = true;
      this.loadingService.hide();
      return;
    }

    // this.passwordsDoNotMatch = false;
    const request: IResetPasswordRequest = {
      token: this.token,
      userName: this.username,
      password: this.changePasswordForm.controls['password'].value,
      passwordRepeat: this.changePasswordForm.controls['passwordRepeat'].value,
      gRecaptchaResponse: '',
    };
    this.signInService.resetPassword(request).subscribe({
      next: () => {
        this.notification.show({
          data: { text: 'La contraseña ha sido actualizada con éxito.' },
          type: NotificationType.toastSuccess,
        });
        this.loadingService.hide();
        setTimeout(() => {
          this.router.navigate(['/auth/signin']);
        }, 1000);
      },
      error: (error) => {
        this.loadingService.hide();
        this.notification.show({
          data: {
            text: error?.error?.Message ?? 'Error al cambiar la contraseña.',
          },
          type: NotificationType.toastWarning,
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
