import { Component } from '@angular/core';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from 'app/shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-profile-summary',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './profile-summary.component.html',
})
export class ProfileSummaryComponent {
  breadcrumb: BreadcrumbItem[] = [
    { text: 'Home', isLink: true, routerLink: '/dashboard' },
    { text: 'Mi Perfil', isLink: false, routerLink: '' },
  ];
}
