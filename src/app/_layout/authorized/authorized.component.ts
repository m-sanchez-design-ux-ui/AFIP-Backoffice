import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Globals, ScreenSize } from 'app/globals';
import { ConfigService } from 'app/shared/services/config.service';

import { NotificationsService } from 'app/shared/services/notifications/notifications.service';
import { MenuDataService } from './data.menu';
import { NotificationsAlertService } from 'app/shared/services/notifications-alert.service';
import { NotificationsComponent } from 'app/shared/components/notifications/notifications.component';
import { Router, RouterOutlet } from '@angular/router';
import { MenuButtonComponent } from 'app/shared/components/menu-button/menu-button.component';

import { FeatherModule } from 'angular-feather';
import { initFlowbite } from 'flowbite';
import { SignInService } from 'app/auth/services/sign-in.service';
import { LoadingService } from 'app/shared/services/loading/loading.service';
import { ModalCustomizedComponent } from 'app/shared/components/modals/modal-customized/modal-customized.component';
import { ModalNotificationsComponent } from 'app/shared/components/modals/modal-notifications/modal-notifications.component';
import { NotificationType } from 'app/shared/interfaces/notifications-models/notification-type';

@Component({
  selector: 'app-authorized',
  standalone: true,
  imports: [
    NotificationsComponent,
    RouterOutlet,
    MenuButtonComponent,
    ModalCustomizedComponent,
    ModalNotificationsComponent,
    FeatherModule,
  ],
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css',
})
export class AuthorizedComponent implements OnInit {
  public role!: string;
  public userName!: string;
  public activeUser = { role: 'Administrador', name: 'Origin' };
  public notifLength!: number;

  buttons: any = [];
  constructor(
    private readonly notifications: NotificationsService,
    private readonly loadingService: LoadingService,
    public configService: ConfigService,
    public globals: Globals,
    // private profileService: ProfileService,
    private readonly signInService: SignInService,
    private readonly notificationsAlertService: NotificationsAlertService,
    private readonly menuDataService: MenuDataService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.buttons = this.menuDataService.getMenuButtons();
  }

  ngOnInit() {
    initFlowbite();
    // this.profileService.getGeneralData().subscribe((res: { data: { isAdmin: any; adminData: { firstName: string; lastName: string; }; userData: { firstName: string; lastName: string; }; }; }) => {
    //   this.role = res.data.isAdmin ? 'Administrador' : 'Usuario';
    //   this.userName = res.data.isAdmin ? res.data.adminData.firstName + ' ' + res.data.adminData.lastName : res.data.userData.firstName + ' ' + res.data.userData.lastName;
    //   this.activeUser = {
    //     role: this.role,
    //     name: this.userName
    //   }
    // })
    //this.getNotif();
    this.notificationsAlertService.refreshNotifLength.subscribe(
      (newNotifLength: number) => {
        this.notifLength = newNotifLength;
      }
    );

    this.cdr.detectChanges();
  }

  public onBtnMenuClick() {
    this.globals.collapseMenu(!this.globals.menuCollapsed);
  }

  public onModuleClick() {
    if (this.globals.screenSize === ScreenSize.Small) {
      this.globals.collapseMenu();
    }
  }

  public onLogout() {
    this.signInService.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigateByUrl('/auth/signin');
    });
  }

  public onGoToProfileSummary() {
    this.router.navigateByUrl('/profile');
  }

  public showLoading($event: any) {
    if ($event === true) {
      this.loadingService.show();
    } else {
      this.loadingService.hide();
    }
  }

  public showNotification($event: any) {
    if ($event === true) {
      this.notifications.show({
        data: {
          text: `El archivo csv ha sido importado con éxito.`,
        },
        type: NotificationType.toastSuccess,
      });
    } else {
      this.notifications.show({
        data: {
          text: `El archivo csv no se ha podido importar correctamente porque tiene errores en su formato.`,
        },
        type: NotificationType.toastDanger,
      });
    }
  }
}
