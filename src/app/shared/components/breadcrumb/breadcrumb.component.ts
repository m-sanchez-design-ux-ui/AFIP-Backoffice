import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, FeatherModule],
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {
  breadcrumItems = input<BreadcrumbItem[]>([]);
}

export interface BreadcrumbItem {
  text: string;
  isLink: boolean;
  routerLink: string;
}
